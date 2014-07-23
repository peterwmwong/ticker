import Model from 'helpers/model/Model';
import CampaignMapper from './CampaignMapper';

class Campaign extends Model{}
Campaign.create($=>{

  $.mapper = CampaignMapper;
  $.attr('name', 'string');
  $.attr('ugcid', 'string');
  $.attr('startDate', 'date');
  $.attr('endDate', 'date');
  $.attr('objectives', 'string');
  $.attr('targetGender', 'string');
  $.attr('targetAge', 'string');
  $.attr('targetIncome', 'string');
  $.attr('additionalNotes', 'string');
  $.attr('budgetCents', 'number');

  // TODO(pwong): Temporary
  $.attr('buyerAccount', 'identity');

  // $.hasOne('buyerAccount', 'Client', {inverse: 'campaigns', owner: true});
  // $.hasMany('adPlatforms', 'AdPlatform', {owner: true});
  // $.hasMany('adSizes', 'AdSize', {owner: true});
  // $.hasMany('adServerPlacements', 'AdServerPlacement');
  // $.hasMany('adTypes', 'AdType', {owner: true});
  // $.hasMany('targetCategories', 'Category', {owner: true});
  // $.hasMany('targetMarkets', 'Market', {owner: true});
  // $.hasMany('accountMembers', 'Member', {owner: true});
  // $.hasMany('desiredPositions', 'DesiredPosition', {owner: true});
  // $.hasMany('negotiations', 'Negotiation', {owner: true});
  // $.hasMany('plans', 'Plan', {inverse: 'campaign'});
  // $.hasOne('currentPlan', 'Plan');
  //
  // // for billing
  // $.hasMany('billingLineItems', 'BillingLineItem', {owner: true});
  //
  // @prop 'totalBilledAmountCents', -> propertyAggregation.sum @billingLineItems, 'billedAmountCents'
  // @prop 'totalDeliveredAmountCents', -> propertyAggregation.sum @billingLineItems, 'deliveredAmountCents'
  // @prop 'totalContractedAmountCents', -> propertyAggregation.sum @billingLineItems, 'contractedAmountCents'
  // @prop 'totalUnbilledAmountCents', -> propertyAggregation.sum @billingLineItems, 'unbilledAmountCents'
  //
  // hasCostType: (costType) -> _.some(@billingLineItems, { 'costType': costType })
  //
  // @prop 'totalUnbilledActions', ->
  //   if @hasCostType('CPA')
  //     propertyAggregation.sum _.where(@billingLineItems, { 'costType': 'CPA' }), "unbilledQuantity"
  //
  // @prop 'totalUnbilledClicks', ->
  //   if @hasCostType('CPC')
  //     propertyAggregation.sum _.where(@billingLineItems, { 'costType': 'CPC' }), "unbilledQuantity"
  //
  // @prop 'totalUnbilledImpressions', ->
  //   if @hasCostType('CPM') or @hasCostType('Flat')
  //     impressions = propertyAggregation.sum _.where(@billingLineItems, { 'costType': 'CPM' }), "unbilledQuantity"
  //     impressions += propertyAggregation.sum _.where(@billingLineItems, { 'costType': 'Flat' }), "unbilledQuantity"
  //
  // @prop 'notOrdered', -> _.isEmpty(@billingLineItems)
  //
  // @prop 'lineItems', ->
  //   if @currentPlan
  //     _.flatten _.map @currentPlan.proposals, 'lineItems'
  //   else
  //     []
  //
  // @prop 'sites', -> _(@billingLineItems).pluck('vendorName').uniq().value()
  // @prop 'visiblePlans', -> _(@plans).filter(visible: true).sortBy('createdAt').value()
  //
  // #TEMPORARY UNTIL BACKEND SUPPORTS NUMBERING
  // @prop 'sortedPlans', -> _(@plans).sortBy('createdAt').value()
  //
  // @prop 'totalClientCostCents', -> propertyAggregation.sum @lineItems, 'totalClientCostCents'
  // @prop 'totalMediaCostCents', -> propertyAggregation.sum @lineItems, 'totalMediaCostCents'
  //
  // # generate helpers for getting info about line items of specific cost types
  // _.each LineItem.COST_TYPES, (costTypeDetails, costType)=>
  //   low = costType.toLowerCase()
  //   cap = costType.charAt(0).toUpperCase() + costType.slice(1)
  //
  //   @prop "#{low}LineItems", ->
  //     _.filter @lineItems, (li)-> li.placement.costType?.toLowerCase() is low
  //   @prop "#{low}LineItemsWithCost", ->
  //     _.filter @lineItems, (li)->
  //       (li.placement.costType?.toLowerCase() is low) and (li.unitCostCents?)
  //
  //   @prop "#{low}Units", -> propertyAggregation.sum @["#{low}LineItems"], 'units'
  //   @prop "#{low}UnitsWithCost", -> propertyAggregation.sum @["#{low}LineItemsWithCost"], 'units'
  //
  //   @prop "#{low}TotalMediaCostCents", -> propertyAggregation.sum @["#{low}LineItems"], "totalMediaCostCents"
  //   @prop "#{low}TotalClientCostCents", -> propertyAggregation.sum @["#{low}LineItems"], "totalClientCostCents"
  //
  //   @prop "e#{cap}MediaCents", ->
  //     return null if @["#{low}UnitsWithCost"] <= 0
  //     (propertyAggregation.sum @["#{low}LineItemsWithCost"], 'totalMediaCostCents') / @["#{low}UnitsWithCost"] * costTypeDetails.units
  //
  //   @prop "e#{cap}ClientCents", ->
  //     return null if @["#{low}UnitsWithCost"] <= 0
  //     (propertyAggregation.sum @["#{low}LineItemsWithCost"], 'totalClientCostCents') / @["#{low}UnitsWithCost"] * costTypeDetails.units
  //
  // # Public: Sets the current plan for the campaign, which indicates which
  // # plan tab the user has open. If the campaign is busy, it will send the most
  // # recent current plan once the previous save is complete.
  // #
  // # plan - The plan to set as the current one
  // #
  // # Returns the receiver.
  // setCurrentPlan: (plan)->
  //   return if plan is @currentPlan and not @_queuedCurrentPlan?
  //
  //   @currentPlan = plan
  //
  //   if @$isBusy
  //     @_queuedCurrentPlan = plan
  //   else
  //     @$save 'currentPlan', plan
  //     #FIXME: Promises should always resolve (return) with the model. We should
  //     #   also think if we want to not resolve the original promise if we are
  //     #   going to make another request. (see models/plan.coffee:40)
  //     @$promise.then =>
  //       if @_queuedCurrentPlan
  //         @setCurrentPlan(@_queuedCurrentPlan)
  //         delete @_queuedCurrentPlan
  //
  //   this
  //
  // AGGREGATES =
  //   numOrderedLineItems: 'numLineItems'
  //   impressions: null
  //   clicks: null
  //   totalConversions: null
  //   actualRevenueCents: null
  //   targetRevenueCents: null
  //   estimatedLossCents: null
  //
  // for k, v of AGGREGATES
  //   do (k, v) =>
  //     @::[k] = (filter) ->
  //       f = (n) -> n.latestOrderedProposal?[v || k](filter)
  //       propertyAggregation.sum @negotiations, f
  //
  // RATIOS =
  //   pace: ['actualRevenueCents', 'targetRevenueCents']
  //   clickThroughRate: ['clicks', 'impressions']
  //   conversionRate: ['totalConversions', 'impressions']
  //
  // for k, v of RATIOS
  //   do (k, v) =>
  //     @::[k] = (filter) ->
  //       n = @[v[0]](filter)
  //       d = @[v[1]](filter)
  //       return null if n == null || d == null || d == 0
  //       n / d
  //
  // # Public: Saves the campaign by persisting the ad server placement mappings
  // # currently assigned to the given line item. If the campaign is already busy
  // # saving mappings, then the save is queued up until the current one
  // # completes.
  // #
  // # lineItem - A LineItem object belonging to the campaign to save mappingsx
  // #            for.
  // #
  // # Returns the receiver.
  // saveLineItemMappings: (lineItem, filterStartDate, filterEndDate) ->
  //   if @$isBusy
  //     unless @hasQueuedLineItemMappingSaveFor(lineItem)
  //       (@_queuedLineItemMappingSaves ||= []).push lineItem
  //       @_queuedStartDate = filterStartDate
  //       @_queuedEndDate = filterEndDate
  //   else
  //     @$save 'lineItemMappings', [lineItem], filterStartDate, filterEndDate
  //     @$promise.then => flushLineItemMappingSaveQueue.call(this)
  //   this
  //
  // # Public: Indicates whether the given line item currently has a mapping save
  // # in the queue.
  // hasQueuedLineItemMappingSaveFor: (lineItem) ->
  //   return false unless @_queuedLineItemMappingSaves
  //   lineItem in @_queuedLineItemMappingSaves
  //
  // flushLineItemMappingSaveQueue = ->
  //   if @_queuedLineItemMappingSaves
  //     @$save 'lineItemMappings', @_queuedLineItemMappingSaves, @_queuedStartDate, @_queuedEndDate
  //     delete @_queuedLineItemMappingSaves
  //     delete @_queuedStartDate
  //     delete @_queuedEndDate

});

export default Campaign;
