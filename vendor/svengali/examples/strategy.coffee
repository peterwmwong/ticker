#
# Presumed chnages
# - Model: get/query/save return promiees
#

CMM.factory 'strategyState', (
  planningState,
  fulfillmentState,
  analyticsState,
  Initiative,
  Campaign,
  PropertyVendor
)->

  attrs:
    mainComponent: 'Strategy'

  states:
    'initiativeIndex':
      attrs:
        strategyComponent : 'InitiativeIndex'
        initiatives       : -> Initiative.query()

      events:
        selectInitiative: goto '../initiativeShow', ({id})-> initiativeId: id

      states:
        'dialog': defaultState
          states:
            'none': defaultState
              events:
                createInitiative: '../createInitiative'

            'createInitiative':
              attrs:
                initiative                 : -> new Initiative
                showCreateInitiativeDialog : true

              events:
                cancelCreateInitiative : '../none'
                saveInitiative         : goto '../../../initiativeShow', ->
                  @initiative.$save().then => initiativeId: @initiative.id

    'initiativeShow':
      params: {initiativeId:'string'}

      attrs:
        intiative         : ({intiativeId})-> Initiative.get initiativeId
        strategyComponent : 'Intiative'

      events:
        selectCampaign: goto '../campaignShow', ({id})-> {campaignId: id}

      states:
        'dialog': defaultState
          states:
            'none': defaultState
              events:
                editInitiative : '../editInitiative'
                createCampaign : '../createCampaign'

            'editInitiative':
              attrs:
                showEditInitiativeDialog: true

              events:
                cancelEditInitiative : goto '../none', -> @initiative.$undoChanges()
                saveInitiative       : goto '../none', -> @initiative.$save()

            'createCampaign':
              attrs:
                showCreateCampaignDialog : true
                campaign                 : -> @initiative.buildCampaign()

              events:
                cancelCreateCampaign : goto '../none', -> @campaign.initiative = null
                saveCampaign         : goto '../../../campaignShow', ->
                  @campaign.$save().then =>
                    initiativeId: @campaign.initiative.id
                    campaignId: @campaign.id

    'campaignShow':
      params: ['campaignId']
      attrs:
        strategyComponent : 'Campaign'
        propertyVendors   : -> PropertyVendor.query()
        campaign          : ({campaignId})-> Campaign.get campaignId, refresh: yes
        # TODO(pwong): How can we avoid selectedMediaPlan relying on campaign?
        selectedMediaPlan : -> @resolveAttr('campaign').then (c)->c.mediaPlans[0]

      concurrentStates:
        'dialog':
          states:
            'none': defaultState
              events:
                editCampaign : '../editCampaign'
                newMediaPlan : '../newMediaPlan'

            'editCampaign':
              attrs:
                showEditCampaignDialog = true

              events:
                cancelEditCampaign : goto '../none', -> @campaign.$undoChanges()
                saveCampaign       : goto '../none', -> @campaign.$save()

            'newMediaPlan':
              attrs:
                showEditMediaPlanDialog : true
                newMediaPlan            : -> @campaign.buildMediaPlan()

              events:
                cancelNewMediaPlan : '../none'
                saveMediaPlan      : goto '../none', ->
                  @newMediaPlan.$save()
                  @newMediaPlan.$promise
                    .then =>
                      @campaign = Campaign.get @campaign.id, refresh: yes
                      @campaign.$promise
                    .then =>
                      @selectedMediaPlan = @campaign.mediaPlans[0]

        'tab':
          states:
            'planning'    : defaultState planningState
            'fulfillment' : fulfillmentState
            'analytics'   : analyticsState
