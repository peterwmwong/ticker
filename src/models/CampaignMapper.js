import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';

// function getOptionValue(targetingOption){
//   return (!!targetingOption && targetingOption !== "None") ?
//     targetingOption :
//     undefined;
// }

// function updateLineItemMappings(campaign, lineItems, filterStartDate, filterEndDate){
//   lineItemData = for lineItem in lineItems
//     id: lineItem.id,
//     placements: _.pluck(lineItem.adServerPlacements, 'id')
//
//   data =
//     id: campaign.id
//     line_items: lineItemData
//     date_filter_start_date: moment(filterStartDate).format('YYYY-MM-DD') if filterStartDate
//     date_filter_end_date: moment(filterEndDate).format('YYYY-MM-DD') if filterEndDate
//
//   $http.post("/api/campaigns/#{campaign.id}/map", data).then (data: response) ->
//     for li in response.line_items
//       unless campaign.hasQueuedLineItemMappingSaveFor(lineItem)
//         lineItem.$load AttrMunger.camelize(li)
//     campaign
// }

// setCurrentPlan = (campaign, plan)->
//   $http.post("/api/campaigns/#{campaign.id}/set_current_plan", id: campaign.id, plan_id: plan.id).then (data: response)->
//     campaign

export default {
  query:array=>{
    return loadJSON("/api/campaigns").then(({campaigns})=>
      array.$replace(
        array.$class.loadAll(
          AttrMunger.camelize(campaigns)))
    );
  }

  // get: (campaign, opts={}) ->
  //   params = angular.extend {}, opts
  //   if params.dateFilterStartDate instanceof Date
  //     params.dateFilterStartDate = moment(params.dateFilterStartDate).format('YYYY-MM-DD')
  //
  //   if params.dateFilterEndDate instanceof Date
  //     params.dateFilterEndDate = moment(params.dateFilterEndDate).format('YYYY-MM-DD')
  //
  //   $http.get("/api/campaigns/#{campaign.id}", params: AttrMunger.underscore(params)).then (data: response) ->
  //     attrs = AttrMunger.camelize(response.campaign)
  //     attrs.targetMarkets = attrs.targetGeographicIds
  //     campaign.$load attrs

  // create: (campaign) ->
  //   data = AttrMunger.underscore(campaign: campaign.$attrs())
  //   data.campaign.ad_platform_ids       = _.pluck campaign.adPlatforms, 'id'
  //   data.campaign.ad_size_ids           = _.pluck campaign.adSizes, 'id'
  //   data.campaign.ad_type_ids           = _.pluck campaign.adTypes, 'id'
  //   data.campaign.user_uuids            = _.pluck campaign.accountMembers, 'id'
  //   data.campaign.desired_position_ids  = _.pluck campaign.desiredPositions, 'id'
  //   data.campaign.target_geographic_ids = _.pluck campaign.targetMarkets, 'id'
  //   data.campaign.target_category_ids   = _.pluck campaign.targetCategories, 'id'
  //   data.campaign.buyer_account_id      = campaign.client?.accountId
  //   data.campaign.target_gender         = getOptionValue campaign.targetGender
  //   data.campaign.target_age            = getOptionValue campaign.targetAge
  //   data.campaign.target_income         = getOptionValue campaign.targetIncome
  //
  //   $http.post("/api/campaigns", data).then (data: response) ->
  //     campaign.$load AttrMunger.camelize(response.campaign)
  //     campaign
  //
  // update: (campaign, ctx, args...) ->
  //   switch ctx
  //     when 'lineItemMappings'
  //       updateLineItemMappings campaign, args...
  //     when 'currentPlan'
  //       setCurrentPlan campaign, args[0]
  //     else
  //       throw new Error("CampaignMapper.update: unknown context: '#{ctx}'")

};
