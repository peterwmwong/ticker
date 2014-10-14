CMM.factory 'planningState', ($state, Campaign, Tactic) ->
  $route: '/campaigns/:campaignId/planning'

  $attrs:
    selectedTab: -> @$name

  $default: ->
    $on:
      editMediaPlan: '../editMediaPlan'
      toggleManageAddonDrafts: '../manageAddonDrafts'

  editMediaPlan:
    $attrs:
      mediaPlanEditEnabled: true

    $enter: -> @campaign.ensureOneTactic()

    $on:
      exitMediaPlanEdit: goto '../default', ->
        @selectedMediaPlan.$undoChanges()
        for tactic in @campaign.tactics.slice()
          tactic.$undoChanges()
          tactic.campaign = null if tactic.$isNew

  manageAddonDrafts:
    $attrs:
      showAddonListPanel: true

    edit:
      off: {}
      on:
        $attrs:
          showEditAddonPanel: true
          editAddonDraft: ({addonDraft})-> addOnDraft

        $on:
          cancelEditAddonDraft : goto '../off', -> @editAddonDraft.$undoChanges()
          saveAddonDraft       : asyncGoto '../off', ->
            @editAddonDraft.$save()
            @editAddonDraft.$promise.then =>
              @campaign = Campaign.get @campaign.id, refresh: yes

    $on:
      toggleManageAddonDrafts : '../default'
      newAddonDraft           : goto './edit/on', -> {addOnDraft: @campaign.buildAddonDraft()}
      editAddonDraft          : goto './edit/on', (addonDraft)-> {addOnDraft}
      applyAddonsToTactics    : goto '../', ->
        for tactic in @campaign.tactics.slice()
          for draft in @selectedAddonDrafts.slice()
            addon = tactic.buildAddon(addonDraft: draft)
            #addon = new Addon
            #addon.tactic = tactic
            #addon.addonDraft = draft
            #addon.orderedUnits = tactic.orderedUnits
            addon.$save()
            #addon.$promise.then =>
            #  tactic.addons.push(addon)
