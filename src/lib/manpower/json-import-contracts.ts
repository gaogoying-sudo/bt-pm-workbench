export const manpowerJsonImportContract = {
  versionContext: {
    projectId: 'project-pm-workbench',
    compareVersionId: 'version-pmw-b1',
    actualVersionId: 'version-pmw-r2'
  },
  roleFormulaParams: [
    {
      roleId: 'role-backend-p4',
      overtimeFactor: 1.2,
      monthlyCostAdjustment: 3000
    }
  ],
  actualStageInputs: [
    {
      stageId: 'stage-pmw-3',
      actualPersonDays: 80,
      actualCost: 171600
    }
  ],
  comparisonOverrides: [
    {
      stageId: 'stage-pmw-3',
      riskNote: 'Development stage entered high volatility window'
    }
  ]
};
