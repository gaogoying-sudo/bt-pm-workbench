'use client';

import { useEffect, useState } from 'react';
import { InfoCard } from '@/components/ui/info-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { manpowerProjects } from '@/data/manpower/manpower-projects';
import { hiringDemands } from '@/data/resources/hiring-demands';
import { peopleResources } from '@/data/resources/people-resources';
import { projectAllocations } from '@/data/resources/project-allocations';
import { resourceRoles } from '@/data/resources/resource-roles';
import { sensitiveCostProfiles } from '@/data/resources/sensitive-cost-profiles';
import { taskActivityRecords } from '@/data/task-execution/task-activity-records';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { buildPersonTaskLoadAggregates } from '@/lib/task-execution/person-load-selectors';
import { AvailabilityStatus, PersonResourceStatus } from '@/lib/types/people-resources';

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const viewModes = ['People view', 'Role view', 'Resource pool', 'Hiring gap'] as const;

const statusOptions: Array<{ label: string; value: PersonResourceStatus | 'all' }> = [
  { label: 'All status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On leave', value: 'on-leave' },
  { label: 'Unavailable', value: 'unavailable' },
  { label: 'Candidate', value: 'candidate' },
  { label: 'Pipeline', value: 'pipeline' },
  { label: 'Archived', value: 'archived' }
];

const availabilityOptions: Array<{ label: string; value: AvailabilityStatus | 'all' }> = [
  { label: 'All availability', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Partially available', value: 'partially-available' },
  { label: 'Fully allocated', value: 'fully-allocated' },
  { label: 'Unavailable', value: 'unavailable' }
];

function personStatusTone(status: PersonResourceStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'candidate' || status === 'pipeline') return 'warning' as const;
  if (status === 'unavailable') return 'danger' as const;
  return 'muted' as const;
}

function availabilityTone(status: AvailabilityStatus) {
  if (status === 'available') return 'success' as const;
  if (status === 'partially-available') return 'warning' as const;
  if (status === 'fully-allocated') return 'danger' as const;
  return 'muted' as const;
}

function urgencyTone(urgency: 'high' | 'medium' | 'low') {
  if (urgency === 'high') return 'danger' as const;
  if (urgency === 'medium') return 'warning' as const;
  return 'success' as const;
}

function maskValue(value: string) {
  return value.length <= 4 ? '****' : `${value.slice(0, 2)}****${value.slice(-1)}`;
}

export function PeopleResourcesWorkbench() {
  const [selectedPersonId, setSelectedPersonId] = useState(peopleResources[0]?.id ?? '');
  const [selectedStatus, setSelectedStatus] = useState<PersonResourceStatus | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<string | 'all'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<(typeof viewModes)[number]>('People view');

  const filteredPeople = peopleResources.filter((person) => {
    if (selectedStatus !== 'all' && person.status !== selectedStatus) return false;
    if (selectedRole !== 'all' && person.primaryRoleId !== selectedRole && !person.secondaryRoleIds.includes(selectedRole)) return false;
    if (selectedProjectId !== 'all' && !person.currentProjectIds.includes(selectedProjectId)) return false;
    if (selectedAvailability !== 'all' && person.availabilityStatus !== selectedAvailability) return false;
    return true;
  });

  useEffect(() => {
    if (!filteredPeople.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(filteredPeople[0]?.id ?? peopleResources[0]?.id ?? '');
    }
  }, [filteredPeople, selectedPersonId]);

  const selectedPerson =
    filteredPeople.find((person) => person.id === selectedPersonId) ?? filteredPeople[0] ?? peopleResources[0];
  const selectedPersonAllocations = projectAllocations.filter((allocation) => allocation.personId === selectedPerson?.id);
  const selectedPersonProfile = sensitiveCostProfiles.find((profile) => profile.personId === selectedPerson?.id);
  const personTaskLoads = buildPersonTaskLoadAggregates(peopleResources, taskExecutionRecords, taskActivityRecords);
  const selectedPersonTaskSummary = personTaskLoads.find((aggregate) => aggregate.personId === selectedPerson?.id);

  const totalPeople = peopleResources.length;
  const activePeople = peopleResources.filter((person) => person.status === 'active').length;
  const candidateAndPipelineCount =
    peopleResources.filter((person) => person.status === 'candidate' || person.status === 'pipeline').length +
    hiringDemands.reduce((sum, demand) => sum + demand.headcount, 0);
  const fullyAllocatedCount = peopleResources.filter((person) => person.availabilityStatus === 'fully-allocated').length;
  const partiallyAvailableCount = peopleResources.filter((person) => person.availabilityStatus === 'partially-available').length;
  const crossProjectCount = peopleResources.filter((person) => person.currentProjectIds.length > 1).length;

  const roleSummaries = resourceRoles.map((role) => {
    const people = peopleResources.filter(
      (person) => person.primaryRoleId === role.id || person.secondaryRoleIds.includes(role.id)
    );
    const demandCount = hiringDemands
      .filter((demand) => demand.roleId === role.id && demand.status !== 'closed')
      .reduce((sum, demand) => sum + demand.headcount, 0);

    return {
      role,
      peopleCount: people.length,
      availableCount: people.filter((person) => person.availabilityStatus === 'available' || person.availabilityStatus === 'partially-available').length,
      fullCount: people.filter((person) => person.availabilityStatus === 'fully-allocated').length,
      demandCount
    };
  });

  const scarceRoleCount = roleSummaries.filter((summary) => summary.availableCount <= 1 && summary.demandCount > 0).length;
  const projectAllocationSummaries = manpowerProjects.map((project) => ({
    project,
    allocations: projectAllocations.filter((allocation) => allocation.projectId === project.id)
  }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        <InfoCard title="Total people" value={totalPeople} />
        <InfoCard title="Active people" value={activePeople} />
        <InfoCard title="Candidate + hiring pool" value={candidateAndPipelineCount} />
        <InfoCard title="Fully allocated" value={fullyAllocatedCount} />
        <InfoCard title="Partially available" value={partiallyAvailableCount} />
        <InfoCard title="Scarce roles" value={scarceRoleCount} />
        <InfoCard title="Cross-project people" value={crossProjectCount} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Person status</label>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as PersonResourceStatus | 'all')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Role filter</label>
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All roles</option>
              {resourceRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Project filter</label>
            <select value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All projects</option>
              {manpowerProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Availability filter</label>
            <select value={selectedAvailability} onChange={(event) => setSelectedAvailability(event.target.value as AvailabilityStatus | 'all')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[280px] flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Display mode</label>
            <div className="flex flex-wrap gap-2">
              {viewModes.map((mode) => (
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-md border px-3 py-2 text-sm ${viewMode === mode ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Current mode: <span className="font-medium text-slate-900">{viewMode}</span>. The page is organized for project planning, staffing and allocation analysis rather than HR administration.
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">People table</h2>
              <p className="text-sm text-slate-500">Project-facing roster with role, load and availability context.</p>
            </div>
            <StatusBadge label={`${filteredPeople.length} people`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Primary role</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Projects</th>
                  <th className="px-4 py-3">Utilization</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Skill tags</th>
                  <th className="px-4 py-3">Sensitive</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => {
                  const role = resourceRoles.find((item) => item.id === person.primaryRoleId);
                  return (
                    <tr key={person.id} className={`border-t border-slate-100 ${selectedPerson?.id === person.id ? 'bg-slate-50' : 'bg-white'}`}>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedPersonId(person.id)} className="text-left">
                          <div className="font-medium text-slate-900">{person.displayName}</div>
                          <div className="text-xs text-slate-500">{person.department}</div>
                        </button>
                      </td>
                      <td className="px-4 py-3">{role?.name ?? person.primaryRoleId}</td>
                      <td className="px-4 py-3">{person.seniorityLevel}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={person.status} tone={personStatusTone(person.status)} />
                      </td>
                      <td className="px-4 py-3">{person.currentProjectIds.length}</td>
                      <td className="px-4 py-3">{percentFormatter.format(person.currentUtilization)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={person.availabilityStatus} tone={availabilityTone(person.availabilityStatus)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {person.skillTags.slice(0, 3).map((tag) => (
                            <StatusBadge key={tag} label={tag} tone="muted" />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">{person.isSensitiveProfile ? <StatusBadge label="Masked profile" tone="warning" /> : <StatusBadge label="No" tone="muted" />}</td>
                      <td className="px-4 py-3 text-slate-600">{person.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Person detail</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-lg font-semibold text-slate-900">{selectedPerson?.displayName}</div>
              <div className="mt-1 text-sm text-slate-500">{selectedPerson?.name}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={selectedPerson?.status} tone={selectedPerson ? personStatusTone(selectedPerson.status) : 'muted'} />
                <StatusBadge label={selectedPerson?.availabilityStatus} tone={selectedPerson ? availabilityTone(selectedPerson.availabilityStatus) : 'muted'} />
                <StatusBadge label={selectedPerson?.employeeType} tone="muted" />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Base profile</div>
                <div className="mt-2 text-sm text-slate-700">Department: {selectedPerson?.department}</div>
                <div className="mt-1 text-sm text-slate-700">Location: {selectedPerson?.location}</div>
                <div className="mt-1 text-sm text-slate-700">Join date: {selectedPerson?.joinDate}</div>
                <div className="mt-1 text-sm text-slate-700">Available capacity: {selectedPerson?.availableCapacity} days</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Role ownership</div>
                <div className="mt-2 text-sm text-slate-700">
                  Primary: {resourceRoles.find((role) => role.id === selectedPerson?.primaryRoleId)?.name}
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  Secondary: {selectedPerson?.secondaryRoleIds.map((roleId) => resourceRoles.find((role) => role.id === roleId)?.name ?? roleId).join(', ') || 'None'}
                </div>
                <div className="mt-1 text-sm text-slate-700">Utilization: {selectedPerson ? percentFormatter.format(selectedPerson.currentUtilization) : '-'}</div>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Current allocations</div>
              <div className="mt-3 space-y-3 text-sm">
                {selectedPersonAllocations.length > 0 ? (
                  selectedPersonAllocations.map((allocation) => {
                    const project = manpowerProjects.find((item) => item.id === allocation.projectId);
                    const role = resourceRoles.find((item) => item.id === allocation.roleId);
                    return (
                      <div key={allocation.id} className="rounded-md bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-slate-900">{project?.name ?? allocation.projectId}</div>
                          <StatusBadge label={allocation.status} tone={allocation.status === 'active' ? 'success' : 'warning'} />
                        </div>
                        <div className="mt-2 text-slate-700">
                          {role?.name ?? allocation.roleId} / {percentFormatter.format(allocation.allocationRate)} / {allocation.allocationMode}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {allocation.startDate} to {allocation.endDate}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Phases: {allocation.phaseIds.join(', ')}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500">No active project allocation records.</div>
                )}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Skill tags and notes</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedPerson?.skillTags.map((tag) => (
                  <StatusBadge key={tag} label={tag} tone="muted" />
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-700">{selectedPerson?.notes}</p>
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Task execution summary</div>
              <div className="mt-2 text-sm text-slate-700">Owned tasks: {selectedPersonTaskSummary?.ownedTaskCount ?? 0}</div>
              <div className="mt-1 text-sm text-slate-700">Blocked tasks: {selectedPersonTaskSummary?.blockedTaskCount ?? 0}</div>
              <div className="mt-1 text-sm text-slate-700">Actual work days: {selectedPersonTaskSummary?.actualWorkDays ?? 0}</div>
              <div className="mt-1 text-sm text-slate-700">Load risk: {selectedPersonTaskSummary?.loadRiskLevel ?? 'low'}</div>
              <div className="mt-1 text-xs text-slate-500">{selectedPersonTaskSummary?.summaryText ?? 'No current task execution signal.'}</div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs uppercase tracking-wide text-amber-700">Sensitive cost placeholder</div>
              {selectedPersonProfile ? (
                <div className="mt-2 space-y-1 text-sm text-amber-900">
                  <div>Salary band: {maskValue(selectedPersonProfile.salaryBand)}</div>
                  <div>Cost center: {maskValue(selectedPersonProfile.costCenter)}</div>
                  <div>Visibility: {selectedPersonProfile.visibilityScope}</div>
                  <div>Mocked: {selectedPersonProfile.isMocked ? 'yes' : 'no'}</div>
                </div>
              ) : (
                <div className="mt-2 text-sm text-amber-900">No sensitive profile attached or profile intentionally hidden.</div>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Role capability overview</h2>
              <p className="text-sm text-slate-500">Capacity and scarcity viewed from role ownership and demand pressure.</p>
            </div>
            <StatusBadge label={`${roleSummaries.length} roles`} tone="muted" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">People</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Full</th>
                  <th className="px-4 py-3">Hiring demand</th>
                  <th className="px-4 py-3">Default capacity</th>
                  <th className="px-4 py-3">Role note</th>
                </tr>
              </thead>
              <tbody>
                {roleSummaries.map((summary) => (
                  <tr key={summary.role.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{summary.role.name}</div>
                      <div className="text-xs text-slate-500">{summary.role.category}</div>
                    </td>
                    <td className="px-4 py-3">{summary.peopleCount}</td>
                    <td className="px-4 py-3">{summary.availableCount}</td>
                    <td className="px-4 py-3">{summary.fullCount}</td>
                    <td className="px-4 py-3">{summary.demandCount}</td>
                    <td className="px-4 py-3">{summary.role.defaultCapacity} days</td>
                    <td className="px-4 py-3 text-slate-600">{summary.role.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Project to people summary</h2>
          <div className="mt-4 space-y-3">
            {projectAllocationSummaries.map(({ project, allocations }) => (
              <div key={project.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900">{project.name}</div>
                  <StatusBadge label={`${allocations.length} allocations`} tone="muted" />
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {allocations
                    .map((allocation) => peopleResources.find((person) => person.id === allocation.personId)?.displayName ?? allocation.personId)
                    .join(', ') || 'No assigned people'}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="font-medium text-slate-900">Project allocation relations</h2>
            <p className="text-sm text-slate-500">Person to project allocation records reserved for planning, cost and task distribution.</p>
          </div>
          <StatusBadge label={`${projectAllocations.length} records`} tone="muted" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Allocation</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {projectAllocations.map((allocation) => {
                const person = peopleResources.find((item) => item.id === allocation.personId);
                const project = manpowerProjects.find((item) => item.id === allocation.projectId);
                const role = resourceRoles.find((item) => item.id === allocation.roleId);
                return (
                  <tr key={allocation.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{person?.displayName ?? allocation.personId}</td>
                    <td className="px-4 py-3">{project?.name ?? allocation.projectId}</td>
                    <td className="px-4 py-3">{role?.name ?? allocation.roleId}</td>
                    <td className="px-4 py-3">{percentFormatter.format(allocation.allocationRate)}</td>
                    <td className="px-4 py-3">{allocation.allocationMode}</td>
                    <td className="px-4 py-3">{allocation.startDate} to {allocation.endDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={allocation.status} tone={allocation.status === 'active' ? 'success' : allocation.status === 'paused' ? 'warning' : 'muted'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-medium text-slate-900">Hiring gap and resource pool</h2>
              <p className="text-sm text-slate-500">Future staffing gaps are kept separate from on-board resources.</p>
            </div>
            <StatusBadge label={`${hiringDemands.reduce((sum, demand) => sum + demand.headcount, 0)} heads`} tone="warning" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Demand role</th>
                  <th className="px-4 py-3">Target level</th>
                  <th className="px-4 py-3">Source project</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Planned start</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Headcount</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Budget</th>
                </tr>
              </thead>
              <tbody>
                {hiringDemands.map((demand) => {
                  const role = resourceRoles.find((item) => item.id === demand.roleId);
                  const project = manpowerProjects.find((item) => item.id === demand.demandSourceProjectId);
                  return (
                    <tr key={demand.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{role?.name ?? demand.roleId}</td>
                      <td className="px-4 py-3">{demand.targetLevel}</td>
                      <td className="px-4 py-3">{project?.name ?? demand.demandSourceProjectId}</td>
                      <td className="px-4 py-3">{demand.demandPhaseId}</td>
                      <td className="px-4 py-3">{demand.plannedStartDate}</td>
                      <td className="px-4 py-3">{demand.expectedDuration}</td>
                      <td className="px-4 py-3">{demand.headcount}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={demand.urgency} tone={urgencyTone(demand.urgency)} />
                      </td>
                      <td className="px-4 py-3">{demand.status}</td>
                      <td className="px-4 py-3">{demand.budgetRange}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-medium text-slate-900">Sensitive cost placeholder</h2>
          <p className="mt-2 text-sm text-slate-600">
            This block intentionally shows masked mock data only. Real salary and cost data should be connected through a dedicated restricted service and permission layer.
          </p>
          <div className="mt-4 space-y-3">
            {sensitiveCostProfiles.map((profile) => {
              const person = peopleResources.find((item) => item.id === profile.personId);
              return (
                <div key={profile.id} className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-amber-900">{person?.displayName ?? profile.personId}</div>
                    <StatusBadge label={profile.visibilityScope} tone="warning" />
                  </div>
                  <div className="mt-2 text-sm text-amber-900">Salary band: {maskValue(profile.salaryBand)}</div>
                  <div className="mt-1 text-sm text-amber-900">Cost center: {maskValue(profile.costCenter)}</div>
                  <div className="mt-1 text-xs text-amber-800">Mock profile: {profile.isMocked ? 'yes' : 'no'} / Future source: restricted finance service</div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}
