	Environment.Value("Route") = ""
	
If VerifyScreenHeader("ROUTE STATUS")=False Then
	Call func_SetReturnCodeToZero()
End If
	
Environment.Value("Purpose") = "reviewclose"

Select Case UCase(Environment.Value("Purpose"))
	Case "REVIEWCLOSE"
		Call func_reportStatus("Done","Review/Close the Route","")
		Call func_ReviewCloseRoute()
	Case "OPEN"	
		Call func_reportStatus("Done","Open Route","")	
		Call func_OpenRoute()
	Case "START"
		Call func_reportStatus("Done","Start Route","")
		Call func_StartRoute()	
	Case "FINISH"
		Call func_reportStatus("Done","Finish Route","")
		Call func_FinishRoute()
	Case "END"
		Call func_reportStatus("Done","END Route","")
		Call func_EndRoute()
End Select

Function func_ReviewCloseRoute()					
		If Environment.Value("Route")="" Then			
			Call func_SetCursorOnRouteByStatus("ENDR")			
		Else
			Call func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"ENDR")
		End If
		
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey "C"
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_ENTER
		intTotalLifts = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS002").TeField("TotalLifts").GetROProperty("text"))
		intActualLifts = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS002").TeField("ActualLifts").GetROProperty("text"))
		If intTotalLifts=intActualLifts Then
			TeWindow("InfoProWindow").TeScreen("BIGDS002").SendKey TE_PF11
			TeWindow("InfoProWindow").TeScreen("BIGDS002").Sync
			
			TeWindow("InfoProWindow").TeScreen("BIGDS002").SendKey TE_PF11
			TeWindow("InfoProWindow").TeScreen("BIGDS002").Sync	
			intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
			intStatusFieldID = intRouteFieldID-15
			strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
			
			If strStatus="CLSE" Then			
				Call func_reportStatus("PASS", "Verify Status","Review and Close has been done succussfully. The status : CLSE")
'				If Trim(UCase(Environment.Value("NavigateBackTOSelection")))="YES" Then
'					TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
'					TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
'				End If
			Else
				Call func_reportStatus("FAIL", "Verify Status","Review and Close is NOT done succussfully. The status : " & strStatus)
				Call func_SetReturnCodeToZero()
			End If
		Else
			TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
			Reporter.ReportEvent micFail,"Mis-match in the Number of Lifts","Total Lifts do not equal Actual Lifts.  Review Lifts Summary." & VBLF &  "ACTUAL LIFTS : " & intActualLifts & ". TOTAL LIFTS : " & intTotalLifts
			Call func_reportStatus("FAIL", "Mis-match in the Number of Lifts","Total Lifts do not equal Actual Lifts.  Review Lifts Summary." & VBLF &  "ACTUAL LIFTS : " & intActualLifts & ". TOTAL LIFTS : " & intTotalLifts)		
			Call func_SetReturnCodeToZero()
		End If	
End Function


Function func_SetCursorOnRouteByStatus(strExpStatus)
	intStatusCount =  GetChildObjectCountByText(strExpStatus)
	If intStatusCount<1 Then
		Call func_reportStatus("Fail","Find Route with " & strExpStatus & " status","No Route is found with the '" & strExpStatus & "' status")
		Call func_SetReturnCodeToZero()
	End If
	intStatusFieldID = func_SearchItemInGrid(strExpStatus,0)
	intRouteFieldID = intStatusFieldID+15
	intLiftFieldID = intStatusFieldID+33
	Environment.Value("Lifts") = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intLiftFieldID).GetROProperty("text"))
	Environment.Value("Route") = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intRouteFieldID).GetROProperty("text")
	Call func_reportStatus("Done","Route Number",Environment.Value("Route"))
	TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).SetCursorPos
	TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_TAB
	func_SetCursorOnRouteByStatus = Environment.Value("Route")
End Function


Function func_SetCursorOnRouteByNumberNStatus(intRouteNumber,strExpStatus)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("text:=" & intRouteNumber,"Protected:=True").Exist(3) Then
		Call func_reportStatus("Pass","Verify Route " & intRouteNumber,"The Route " & intRouteNumber & " is available")
		intRouteFieldID = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("text:=" & intRouteNumber,"Protected:=True").GetROProperty("field id")
		intStatusFieldID = intRouteFieldID-15
		intLiftFieldID = intStatusFieldID+33
		Environment.Value("Lifts") = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intLiftFieldID).GetROProperty("text"))
		strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
		If UCase(strStatus)=strExpStatus Then
			Call func_reportStatus("Pass","Verify the Route Status","The Route status : " & strStatus)
			TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).SetCursorPos
			TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_TAB
		Else
			Call func_reportStatus("Fail","Verify the Route Status","Status Expected is " & strExpStatus & ".But Found " & strStatus)
			Call func_SetReturnCodeToZero()
		End If
	End If
End Function


Function func_OpenRoute()
	If Environment.Value("Route")="" Then
		Call func_SetCursorOnRouteByStatus("INAC")			
	Else
		Call func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"INAC")
	End If
	'intLift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("Lifts").GetROProperty("text"))
	Call func_sendkey("O")
	Call func_sendkey("ENTER")
	'intLift = func_SetToMaxFieldLength(intLift,5)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("OpenRouteWindow").Exist(3) Then
		int_startMileage = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("Mileage").GetROProperty("text"))
		Environment.Value("StartMileage") = int_startMileage
		int_startTimeHour = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartTimeHour").GetROProperty("text"))
		int_startTimeMinute= Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartTimeMinute").GetROProperty("text"))
		
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("LeaveTimeHour").Set int_startTimeHour+1
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("LeaveTimeMinute").Set int_startTimeMinute
		Call func_sendkey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("field id:=1842").GetROProperty("text") = "Check the Route's Open Time (Clock-In Time)." Then
			Call func_reportStatus("Fail","Unable to Open Route","Check the Route's Open Time (Clock-In Time).")
			Call func_sendkey("F12")
			Call func_SetReturnCodeToZero()
		End If
		
		intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
		intStatusFieldID = intRouteFieldID-15
		strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
		If UCase(strStatus)="ACTV" Then
			Call func_reportStatus("Pass","Verify Opened Route & Post Status","The Route has been Opened successfully. Status has been changed to ACTV")
		Else
			Call func_reportStatus("Fail","Verify Opened Route & Post Status","The Route has NOT been Opened successfully. Current Status : " & strStatus)
			Call func_SetReturnCodeToZero()
		End If
	Else
		Call func_reportStatus("Fail","Verify Open Route Window","The 'Open Route' window is NOT Opened")
		Call func_SetReturnCodeToZero()
	End If
End Function

Function func_StartRoute()	

	If Environment.Value("Route")="" Then
		Call func_SetCursorOnRouteByStatus("ACTV")			
	Else
		Call func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"ACTV")
	End If
	'intLift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("Lifts").GetROProperty("text"))
	Call func_sendkey("S")
	Call func_sendkey("ENTER")
	
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("StartLoadWindow").Exist(3) Then
		int_startLoadPrevOdometer = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartLoadPrevOdometer").GetROProperty("text"))
		int_startLoadPrevTime = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartLoadPrevTime").GetROProperty("text"))
		arr_startLoadPrevTime = Split(int_startLoadPrevTime, ":")
		
		If (UBound(arr_startLoadPrevTime) = 0) Then
			int_startLoadTimeMinute =  Trim(arr_startLoadPrevTime(0))
			int_startLoadTimeHour = 0
		Else
			int_startLoadTimeHour = Trim(arr_startLoadPrevTime(0))
			int_startLoadTimeMinute =  Trim(arr_startLoadPrevTime(1))
		End If 'If (UBound(arr_startLoadPrevTime) = 0) Then
		
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartLoadOdometer").Set int_startLoadPrevOdometer + 50
		Wait(1)
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartLoadTimeHour").Set int_startLoadTimeHour + 1
		Wait(1)
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("StartLoadTimeMinute").Set int_startLoadTimeMinute
		Wait(1)
		Call func_sendkey("ENTER")
		Wait(1)
		intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
		intStatusFieldID = intRouteFieldID-15
		strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
		If UCase(strStatus)="S-LD1" Then
			Call func_reportStatus("Pass","Verify Opened Route & Post Status","The Route has been Started successfully. Status has been changed to S-LD1")
		Else
			Call func_reportStatus("Fail","Verify Opened Route & Post Status","The Route has NOT been Started successfully. Current Status : " & strStatus)
			Call func_SetReturnCodeToZero()
		End If
	End If
End Function


Function func_FinishRoute()	
	If Environment.Value("Route")="" Then
		Call func_SetCursorOnRouteByStatus("S-LD1")			
	Else
		Call func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"S-LD1")
	End If
	
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
	intStatusFieldID = intRouteFieldID-15
	intLiftsFieldID = intRouteFieldID+18
	
	str_lift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intLiftsFieldID).GetROProperty("text"))
	str_lift = func_SetToMaxFieldLength(str_lift,5)
	Call func_sendkey("F")
	Call func_sendkey("ENTER")
	
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("FinishLoadWindow").Exist(3) Then
		int_finishLoadPrevOdometer = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadPrevOdometer").GetROProperty("text"))
		int_finishLoadPrevTime = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadPrevTime").GetROProperty("text"))
		arr_finishLoadPrevTime = Split(int_finishLoadPrevTime, ":")
		
		If (UBound(arr_finishLoadPrevTime) = 0) Then
			int_finishLoadTimeMinute = Trim(arr_finishLoadPrevTime(0))
			int_finishLoadTimeHour = 0
		Else
			int_finishLoadTimeHour = Trim(arr_finishLoadPrevTime(0))
			int_finishLoadTimeMinute = Trim(arr_finishLoadPrevTime(1))
		End If 'If (UBound(arr_finishLoadPrevTime) = 0) Then
		
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadOdometer").Set int_finishLoadPrevOdometer + 50
		Wait(1)
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadTimeHour").Set int_finishLoadTimeHour + 1
		Wait(1)
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadTimeMinute").Set int_finishLoadTimeMinute
		Wait(1)
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TEField("FinishLoadLifts").Set str_lift
		Wait(1)
		Call func_sendkey("ENTER")
		Wait(2)
		strStatus = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intStatusFieldID).GetROProperty("text"))
		If UCase(strStatus)="F-LD1" Then
			Call func_reportStatus("Pass","Verify Finish & Post Status","The Route has been Finished successfully. Status has been changed to F-LD1")
		Else
			Call func_reportStatus("Fail","Verify Finish Route & Post Status","The Route has NOT been Finished successfully. Current Status : " & strStatus)
			Call func_SetReturnCodeToZero()
		End If
	End If
End Function



Function func_EndRoute()	
	If Environment.Value("Route")="" Then
		Call func_SetCursorOnRouteByStatus("F-LD1")			
	Else
		Call func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"F-LD1")
	End If
	
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
	intStatusFieldID = intRouteFieldID-15
	intLiftsFieldID = intRouteFieldID+18
	
	'str_lift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intLiftsFieldID).GetROProperty("text"))
	'str_lift = func_SetToMaxFieldLength(str_lift,5)
	Call func_sendkey("E")
	Call func_sendkey("ENTER")
	
	If TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadMileage").Exist(2) Then			
		int_endLoadPrevOdometer = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadPrevMileage").GetROProperty("text"))
		int_endLoadInMinute = int_finishLoadTimeMinute
		int_endLoadInHour = int_finishLoadTimeHour + 1
		int_endLoadOutMinute = int_finishLoadTimeMinute
		int_endLoadOutHour = int_endLoadInHour + 1
	
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadTicketNumber").Set 1234567890
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadQuantity").Set 1.0
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadInHour").Set int_endLoadInHour
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadInMinute").Set int_endLoadInMinute
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadOutHour").Set int_endLoadOutHour
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadOutMinute").Set int_endLoadOutMinute
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS015_DISPOSAL TICKETS ENTRY").TEField("EndLoadMileage").Set int_endLoadPrevOdometer + 50
		Wait(1)
		Call func_SendKey("ENTER")
		Wait(1)
		Call func_SendKey("F3")
		Wait(1)
	End If
	
	If TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadScreen").Exist(5) Then
		Call func_reportStatus("PASS", "End Load screen exists", "")
		int_endLoadPrevOdometer2 = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadPrevMileage2").GetROProperty("text"))
		int_endLoadPrevTime = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadPrevTime").GetROProperty("text"))
		arr_endLoadPrevTime = Split(int_endLoadPrevTime, ":")

		If (UBound(arr_endLoadPrevTime) = 0) Then
			int_endLoadReturnMinute = Trim(arr_endLoadPrevTime(0))
			int_endLoadReturnHour = 0
		Else
			int_endLoadReturnHour = Trim(arr_endLoadPrevTime(0))
			int_endLoadReturnMinute = Trim(arr_endLoadPrevTime(1))
		End If 'If (UBound(arr_endLoadPrevTime) = 0) Then
		
		TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadReturnHour").Set int_endLoadReturnHour
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadReturnMinute").Set int_endLoadReturnMinute
		Wait(1)
		
		TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadEndHour").Set int_endLoadReturnHour + 1
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadEndMinute").Set int_endLoadReturnMinute
		Wait(1)
		TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("EndLoadMileage2").Set ((int_endLoadPrevOdometer2 + 50)&".0")
		Wait(1)
		Call func_sendkey("ENTER")
		Wait(1)
		Call func_sendkey("F3")
		intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
		intStatusFieldID = intRouteFieldID-15
		strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).GetROProperty("text"))
		If UCase(strStatus)="ENDR" Then
			Call func_reportStatus("Pass","Verify Opened Route & Post Status","The Route has been Started successfully. Status has been changed to ENDR")
		Else
			Call func_reportStatus("Fail","Verify Opened Route & Post Status","The Route has NOT been Started successfully. Current Status : " & strStatus)
			Call func_SetReturnCodeToZero()
		End If
		
	Else
		Call func_reportStatus("Fail","Verify End Load Screen","END load screen is not displayed")
		Call func_SetReturnCodeToZero()
	End If 'If TEWindow("InfoProWindow").TEScreen("BIRC01_Route").TEField("EndLoadScreen").Exist(5) Then
	
End Function




