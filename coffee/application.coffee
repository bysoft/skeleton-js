define [
	'eventbus'
	'ext/string'
], (EventBus, StringExt) ->
	
	'use strict'

	###
	Application Class
	###
	class Application

		#
		# Properties
		siteTitle: 'Application'
		currentParams: null
		currentControllerName: null
		currentView: null
		currentViewParams: null
		previousController: null

		#
		# Constructor
		constructor: (@name) ->
			if !@name?
				throw new Error 'Every application must have a name'

			@initializeControllers()
			@initializeEvents()
			return

		_(Application.prototype).defaults Backbone.Events

		#
		# Subscribe to relevant events on EventBus
		initializeEvents: ->
			# Subscribe to the event Route.Matched, so we are able to instanciate a new controler and action
			EventBus.subscribe 'Route.Matched', (route, params) =>
    			controllerName = route.controller
    			action = route.action
    			@initializeControllerAndAction(controllerName, action, params)
		
		#
		# Initialize controllers
		initializeControllers: ->

		#
		# Initializes a controller and a action.
		initializeControllerAndAction: (controllerName, action = 'index', params = {}) ->
			isSameController = @currentControllerName is controllerName

			if isSameController
				isSameAction = @currentAction is action and (@currentParams? or @currentParams)
			else
				controllerFileName = StringExt.underscorize controllerName + '_controller'

				# Use the require.js library to load the controller. When the require is finished, execute
				# the method onControllerLoaded
				require ['controllers/' + controllerFileName], 
					_(@onControllerLoaded).bind(@, controllerName, action, params)
		
		#
		# This method is called when a controller is loaded.
		#
		# When a controller is loaded, we need to dispose the currentController and trigger the specified
		# action the the loaded controller.
		onControllerLoaded: (controllerName, action, params, controllerClass) ->
			@disposeCurrentController
			@initializeController controllerName, params, controllerClass
			@callControllerAction action, params

		#
		# Disposes the actual controller loaded
		disposeCurrentController: ->
			if @currentController
				if @currentController.dispose? and _.isFunction @currentController.dispose
					throw new Error('Application#onControllerLoaded: A dispose method should be provided on ' + controllerName)
				@currentController.dispose()

		#
		# 
		initializeController: (controllerName, params, controllerClass) ->
			# Create a new instance and call the initialize method
			controller = new controllerClass()
			controller.initialize params

			@previousController = this.currentControllerName
			@currentControllerName = controllerName
			@currentController = controller

			@trigger 'Controller.Initialized'

		#
		# Call an action on the current controller
		callControllerAction: (action, params) ->
			if !@currentController?
				throw new Error('You must have an active controller in order to call an specific action')

			actionName = StringExt.camelize action

			unless typeof @currentController[action] is 'function'
				throw new Error("ApplicationView#callControllerAction: We can't find a method called " + 
					actionName + " on the controller " + @currentController.id)
			
			# Call the action passing the parameters
			@currentController[actionName] params

			@currentView = @currentController.view
			@currentViewParams = params

			@trigger 'Action.Called'
                            