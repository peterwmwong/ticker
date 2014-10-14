CMM.factory 'strategyState', (
  $state,
  planningState,
  fulfillmentState,
  analyticsState,
  Initiative,
  Campaign,
  PropertyVendor
)->
  mainComponent:attr 'Strategy'

  initiativeIndex:state
    $route: '/initiatives'
    strategyComponent:attr 'InitiativeIndex'
    initiatives:attr Initiative.query()

    selectInitiative:event '../initiativeShow', ({id})-> initiativeId: id

    dialog:state
      $default:state
        createInitiative:event '../createInitiative'

      createInitiative:state
        initiative:attr -> new Initiative
        showCreateInitiativeDialog:attr true

        saveInitiative:event '../../../initiativeShow', ->
          @initiative.$save()
          @initiative.$promise.then => initiativeId: $state.initiative.id

        cancelCreateInitiative:event '../'

  initiativeShow:state
    $route: '/initiatives/:initiativeId'

    intiative:event ({intiativeId})-> Initiative.get initiativeId
    strategyComponent:event 'Intiative'

    selectCampaign:event '../campaignShow', (campaign)-> {campaignId: campaign.id}

    dialog:state
      $default:state
        editInitiative:event '../editInitiative'
        createCampaign:event '../createCampaign'

      editInitiative:state
        showEditInitiativeDialog:attr true

        cancelEditInitiative:event '../', -> @initiative.$undoChanges()
        saveInitiative:event '../', ->
          @initiative.$save()
          @initiative.$promise

      createCampaign:state
        showCreateCampaignDialog:attr true
        campaign:attr -> @initiative.buildCampaign()

        cancelCreateCampaign:event '../', -> @campaign.initiative = null
        saveCampaign:event '../../../campaignShow', ->
          @campaign.$save()
          @campaign.$promise.then =>
            initiativeId: @campaign.initiative.id
            campaignId: @campaign.id

  campaignShow:state concurrent
    strategyComponent:attr 'Campaign'
    propertyVendors:attr -> PropertyVendor.query()
    selectedMediaPlan:attr undefined
    campaign:attr ({campaignId})->
      Campaign.get campaignId, refresh: yes
      @campaign.$promise.then (c)=> @selectedMediaPlan = c.mediaPlans[0]

    dialog:state
      $default:state
        editCampaign:attr '../editCampaign'
        newMediaPlan:attr '../newMediaPlan'

      editCampaign:state
        showEditCampaignDialog:attr true

        cancelEditCampaign:event '../', -> @campaign.$undoChanges()
        saveCampaign:event '../', ->
          @campaign.$save()
          @campaign.$promise

      newMediaPlan:state
        showEditMediaPlanDialog:attr true
        newMediaPlan:attr -> @campaign.buildMediaPlan()

        cancelNewMediaPlan:event '../'
        saveMediaPlan:event '../', ->
          @newMediaPlan.$save()
          @newMediaPlan.$promise
            .then =>
              @campaign = Campaign.get @campaign.id, refresh: yes
              @campaign.$promise
            .then =>
              @selectedMediaPlan = @campaign.mediaPlans[0]

    tab:state
      planning:state planningState
      fulfillment:state fulfillmentState
      analytics:state analyticsState
