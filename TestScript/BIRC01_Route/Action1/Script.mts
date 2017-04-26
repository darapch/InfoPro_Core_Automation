Dim obj_routeProperty, obj_openRouteProperty, obj_liftProperty, obj_WShell
Dim int_route, int_startMileage, int_startTimeHour, int_startTimeMinute
Dim int_routeColumn, int_liftRow, int_liftColumn, int_lift, str_lift
Dim int_startLoadPrevOdometer, int_startLoadPrevTime, arr_startLoadPrevTime, int_startLoadTimeHour, int_startLoadTimeMinute
Dim int_finishLoadPrevOdometer, int_finishLoadPrevTime, arr_finishLoadPrevTime, int_finishLoadTimeHour, int_finishLoadTimeMinute
Dim int_endLoadPrevOdometer, int_endLoadInMinute, int_endLoadInHour, int_endLoadOutMinute, int_endLoadOutHour
Dim int_endLoadPrevOdometer2, int_endLoadPrevTime, arr_endLoadPrevTime, int_endLoadReturnMinute, int_endLoadReturnHour 

Call func_setScreenProperty("BIRC01_Route")

If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("RouteStatus").Exist(5) Then
	Call func_reportStatus("PASS", "Route Status screen exists", "")
	
	int_route = Environment.Value("Route")
	
	Set obj_routeProperty = TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("Route")
	obj_routeProperty.SetTOProperty "text", int_route
	obj_routeProperty.SetTOProperty "attached text", int_route&".*"
	
	int_routeColumn = CInt(Trim(obj_routeProperty.GetROProperty("start column")))
	int_liftRow = CInt(Trim(obj_routeProperty.GetROProperty("start row")))
	If (int_routeColumn = 17) Then
		int_liftColumn = 35
	Else
		int_liftColumn = 76 
	End If 'If (int_routeColumn = 17) Then
	
	Set obj_liftProperty = TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("Lifts")
	obj_liftProperty.SetTOProperty "start row", int_liftRow
	obj_liftProperty.SetTOProperty "start column", int_liftColumn
	
	int_lift = Trim(TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("Lifts").GetROProperty("text"))
	If (Len(int_lift) = 1) Then
		str_lift = "    "&int_lift
	ElseIf (Len(int_lift) = 2) Then
		str_lift = "   "&int_lift
	ElseIf (Len(int_lift) = 3) Then
		str_lift = "  "&int_lift
	ElseIf (Len(int_lift) = 4) Then
		str_lift = " "&int_lift
	Else
		str_lift = int_lift
	End If 'If (Len(int_lift) = 1) Then
	
	Set obj_WShell = CreateObject("wscript.shell")
	
	If (obj_routeProperty.Exist(5)) Then
		obj_routeProperty.SetCursorPos
		Wait(1)
		obj_WShell.Sendkeys "+{TAB}"
		obj_WShell.Sendkeys "O"
		Wait(1)
		obj_WShell.Sendkeys "{ENTER}"
		
		Set obj_openRouteProperty = TEWindow("InfoProWindow").TEScreen("BIRC01_Route")
		If (obj_openRouteProperty.TEField("OpenRoute").Exist(5)) Then
			Call func_reportStatus("PASS", "Open Route screen exist", "")
			
			int_startMileage = Trim(obj_openRouteProperty.TEField("Mileage").GetROProperty("text"))
			Environment.Value("StartMileage") = int_startMileage
			int_startTimeHour = Trim(obj_openRouteProperty.TEField("StartTimeHour").GetROProperty("text"))
			int_startTimeMinute= Trim(obj_openRouteProperty.TEField("StartTimeMinute").GetROProperty("text"))
			
			obj_openRouteProperty.TEField("LeaveTimeHour").Set int_startTimeHour
			Wait(1)
			obj_openRouteProperty.TEField("LeaveTimeMinute").Set int_startTimeMinute
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)
			
			'Start Load
			obj_routeProperty.SetCursorPos
			Wait(1)
			obj_WShell.Sendkeys "+{TAB}"
			obj_WShell.Sendkeys "S"
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)
			
			int_startLoadPrevOdometer = Trim(obj_openRouteProperty.TEField("StartLoadPrevOdometer").GetROProperty("text"))
			int_startLoadPrevTime = Trim(obj_openRouteProperty.TEField("StartLoadPrevTime").GetROProperty("text"))
			arr_startLoadPrevTime = Split(int_startLoadPrevTime, ":")
			
			If (UBound(arr_startLoadPrevTime) = 0) Then
				int_startLoadTimeMinute =  Trim(arr_startLoadPrevTime(0))
				int_startLoadTimeHour = 0
			Else
				int_startLoadTimeHour = Trim(arr_startLoadPrevTime(0))
				int_startLoadTimeMinute =  Trim(arr_startLoadPrevTime(1))
			End If 'If (UBound(arr_startLoadPrevTime) = 0) Then
			
			obj_openRouteProperty.TEField("StartLoadOdometer").Set int_startLoadPrevOdometer + 50
			Wait(1)
			obj_openRouteProperty.TEField("StartLoadTimeHour").Set int_startLoadTimeHour + 1
			Wait(1)
			obj_openRouteProperty.TEField("StartLoadTimeMinute").Set int_startLoadTimeMinute
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)
			
			'Finish Load
			obj_routeProperty.SetCursorPos
			Wait(1)
			obj_WShell.Sendkeys "+{TAB}"
			obj_WShell.Sendkeys "F"
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)
			
			int_finishLoadPrevOdometer = Trim(obj_openRouteProperty.TEField("FinishLoadPrevOdometer").GetROProperty("text"))
			int_finishLoadPrevTime = Trim(obj_openRouteProperty.TEField("FinishLoadPrevTime").GetROProperty("text"))
			arr_finishLoadPrevTime = Split(int_finishLoadPrevTime, ":")
			
			If (UBound(arr_finishLoadPrevTime) = 0) Then
				int_finishLoadTimeMinute = Trim(arr_finishLoadPrevTime(0))
				int_finishLoadTimeHour = 0
			Else
				int_finishLoadTimeHour = Trim(arr_finishLoadPrevTime(0))
				int_finishLoadTimeMinute = Trim(arr_finishLoadPrevTime(1))
			End If 'If (UBound(arr_finishLoadPrevTime) = 0) Then
			
			obj_openRouteProperty.TEField("FinishLoadOdometer").Set int_finishLoadPrevOdometer + 50
			Wait(1)
			obj_openRouteProperty.TEField("FinishLoadTimeHour").Set int_finishLoadTimeHour + 1
			Wait(1)
			obj_openRouteProperty.TEField("FinishLoadTimeMinute").Set int_finishLoadTimeMinute
			Wait(1)
			obj_openRouteProperty.TEField("FinishLoadLifts").Set str_lift
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)
			
			'End
			obj_routeProperty.SetCursorPos
			Wait(1)
			obj_WShell.Sendkeys "+{TAB}"
			obj_WShell.Sendkeys "E"
			Wait(1)
			obj_WShell.Sendkeys "{ENTER}"
			Wait(1)

			If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("DisposalTicketsEntry").Exist(5) Then
				Call func_reportStatus("PASS", "Disposal Tickets Entry screen exists", "")
				
				int_endLoadPrevOdometer = Trim(obj_openRouteProperty.TEField("EndLoadPrevMileage").GetROProperty("text"))
				int_endLoadInMinute = int_finishLoadTimeMinute
				int_endLoadInHour = int_finishLoadTimeHour + 1
				int_endLoadOutMinute = int_finishLoadTimeMinute
				int_endLoadOutHour = int_endLoadInHour + 1
			
				obj_openRouteProperty.TEField("EndLoadTicketNumber").Set 1234567890
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadQuantity").Set 1.0
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadInHour").Set int_endLoadInHour
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadInMinute").Set int_endLoadInMinute
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadOutHour").Set int_endLoadOutHour
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadOutMinute").Set int_endLoadOutMinute
				Wait(1)
				obj_openRouteProperty.TEField("EndLoadMileage").Set int_endLoadPrevOdometer + 50
				Wait(1)
				obj_WShell.Sendkeys "{ENTER}"
				Wait(1)
				obj_WShell.Sendkeys "{F3}"
				Wait(1)
			
				If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("EndLoadScreen").Exist(5) Then
					Call func_reportStatus("PASS", "End Load screen exists", "")
					int_endLoadPrevOdometer2 = Trim(obj_openRouteProperty.TEField("EndLoadPrevMileage2").GetROProperty("text"))
					int_endLoadPrevTime = Trim(obj_openRouteProperty.TEField("EndLoadPrevTime").GetROProperty("text"))
					arr_endLoadPrevTime = Split(int_endLoadPrevTime, ":")
			
					If (UBound(arr_endLoadPrevTime) = 0) Then
						int_endLoadReturnMinute = Trim(arr_endLoadPrevTime(0))
						int_endLoadReturnHour = 0
					Else
						int_endLoadReturnHour = Trim(arr_endLoadPrevTime(0))
						int_endLoadReturnMinute = Trim(arr_endLoadPrevTime(1))
					End If 'If (UBound(arr_endLoadPrevTime) = 0) Then
					
					obj_openRouteProperty.TEField("EndLoadReturnHour").Set int_endLoadReturnHour
					Wait(1)
					obj_openRouteProperty.TEField("EndLoadReturnMinute").Set int_endLoadReturnMinute
					Wait(1)
					
					obj_openRouteProperty.TEField("EndLoadEndHour").Set int_endLoadReturnHour + 1
					Wait(1)
					obj_openRouteProperty.TEField("EndLoadEndMinute").Set int_endLoadReturnMinute
					Wait(1)
					obj_openRouteProperty.TEField("EndLoadMileage2").Set ((int_endLoadPrevOdometer2 + 50)&".0")
					Wait(1)
					obj_WShell.Sendkeys "{ENTER}"
					Wait(1)
					
				Else
					Call func_reportFailureScreenshot()
					Call func_reportStatus("FAIL", "End Load screen does not exists", "")
				End If 'If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("EndLoadScreen").Exist(5) Then
				
			Else
				Call func_reportFailureScreenshot()
				Call func_reportStatus("FAIL", "Disposal Tickets Entry screen does not exists", "")
			End If 'If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("DisposalTicketsEntry").Exist(5) Then
			
		Else
			Call func_reportFailureScreenshot()
			Call func_reportStatus("FAIL", "Open Route screen does not exist", "")
		End If
		
	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Route: " & Environment.Value("Route") & "Does not exist on the screen", "")
	End If 'If (obj_routeProperty.Exist(5)) Then
	
	Set obj_WShell = Nothing
	Set obj_screenProperty = Nothing
	
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Route Status screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("RouteStatus").Exist(5) Then


