new StateRoutes
  '/': redirectTo '/intiatives'
  '/initiatives': 'intiativeIndex'
  '/initiatives/:initiativeId': 'initiativeShow'
  '/campaigns/:campaignId/': redirectTo '/campaigns/:campaignId/planning'
  '/campaigns/:campaignId/planning': 'campaignShow/planning'
  '/campaigns/:campaignId/fulfillment': 'campaignShow/fulfillment'
  '/campaigns/:campaignId/analytics': 'campaignShow/analytics'

new StateRoutes [
  path '/', redirectTo('intiatives')
  path '/initiatives', 'intiativeIndex',
    path '/:initiativeId', 'initiativeShow',
      path '/edit', 'initiativeShow/editIntiative'
      path '/create-campaign', 'initiativeShow/createCampaign'

  path '/campaigns', redirectTo('/initiatives'),
    path '/:campaignId', redirectTo('/campaigns/:campaignId/planning'),
      path '/planning',    'campaignShow/planning'
      path '/fulfillment', 'campaignShow/fulfillment'
      path '/analytics',   'campaignShow/analytics'
]
