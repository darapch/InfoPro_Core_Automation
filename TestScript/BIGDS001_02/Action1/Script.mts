'Environment.Value("RootPath") = "C:\Users\darapch\Desktop\Automation_Now\InfoPro_Automation\"
RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"	
If VerifyScreenHeader("ROUTE STATUS")=False Then
	Call func_SetReturnCodeToZero()
End If
'Environment.Value("Route") = ""
'Environment.Value("Purpose") = "UPDATE"


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
	Case "DRIVERSERV"
		Call func_reportStatus("Done","Driver Service","")
		If Environment.Value("Route")="" Then
			Call func_SetCursorOnRouteByStatus("ENDR")
		Else		
			intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
			If intRouteFieldID>0 Then
				TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intRouteFieldID).SetCursorPos
				Call func_sendkey("BACKTAB")
				wait(2)
				Call func_sendkey("W")
				Call func_sendkey("ENTER")
				wait(2)
			Else
				Call func_reportStatus("Fail","Select Route","The Route Number " & Environment.Value("Route") & " is NOT found")
				Call func_SetReturnCodeToZero()
			End If
		End If
	Case "BREAK"
		Call func_reportStatus("Done","Break Time","")		
		Call func_BreakTime()
	Case "DOWN"	
		Call func_reportStatus("Done","Down Time","")		
		Call func_DownTime()
	Case "REPLACEMENT"
		Call func_reportStatus("Done","Replace Driver","")	
		Call func_Replacement()
	Case "CANCELROUTE"
		Call func_reportStatus("Done","Cancel Route","")
		Call func_CancelRoute()
	Case "UPDATE"
		Call func_reportStatus("Done","Update Load","")
		Call func_UpdateLoad()
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
			strIFTAMsg = "IFTA Information does not match. Press F17  to access IFTA screen"
			If TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("StatusMsg").GetROProperty("text")=strIFTAMsg Then
				Call func_reportStatus("Fail","IFTA Information","IFTA Information does not match. Input another Route")
				Call func_SetReturnCodeToZero()
			End If
			
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
		If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Driver").Text="" Then
			Call func_SelectInputByHelp("Driver",485)
		End If
		If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Truck").Text="" Then
			Call func_SelectInputByHelp("Truck",483)
		End If
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

		wait(10)
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
		Call func_sendkey("TAB")
		wait(1)
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



			

Function func_VerifyPreConditionForRouteAction()
	If Environment.Value("Route")="" Then
		intRouteFieldID = 0	
		intACTVFieldID = func_SearchItemInGrid("ACTV",0)		
		intSLDFieldID = func_SearchItemInGrid("S-LD1",0)
		intFLDFieldID = func_SearchItemInGrid("F-LD1",0)
		If intACTVFieldID=0 Then 'If the Route not found with ACTV status
			If intSLDFieldID=0 Then 'If the Route not found with SLD status
				If intFLDFieldID=0 Then 'If the Route not found with FLD status
					
				Else
					intStatusFieldID = intFLDFieldID
					intRouteFieldID = intFLDFieldID + 15
				End If
			Else
				intStatusFieldID = intSLDFieldID
				intRouteFieldID = intSLDFieldID + 15
			End If
		Else
			intStatusFieldID = intACTVFieldID
			intRouteFieldID = intACTVFieldID + 15
			intLiftsFieldID = intStatusFieldID + 33
		End If
		If intRouteFieldID=0 Then
			Call func_reportStatus("Fail","No Route Found","No Route Found")
			Call func_SetReturnCodeToZero()
		Else
			Environment.Value("Route") = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intRouteFieldID).Text
			'str_lift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intLiftsFieldID).GetROProperty("text"))
			'Environment.Value("Lifts") = func_SetToMaxFieldLength(str_lift,5)
			strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).Text
			Call func_reportStatus("Pass","Route and Status","Found the Route '" & Environment.Value("Route") & "' with the '" & strStatus & "'")
			TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intRouteFieldID).SetCursorPos
			Call func_SendKey("BACKTAB")
		End If		
	Else
		strStatus = func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"")
		If strStatus="ENDR" Or strStatus="CLSE" Or strStatus="INAC" Then
			Call func_reportStatus("Fail","Verify the Status","Status for the Route " & Environment.Value("Route") & " is Not Meeting the Pre-Condition. Actual:" & strStatus & ", Expected: ACTV or SLD-1 or FLD-1")
			Call func_SetReturnCodeToZero()
		End If		
	End If	
End Function




Function func_BreakTime()
	Call func_VerifyPreConditionForRouteAction()
	Call func_sendKey("B")
	Call func_sendKey("ENTER")
	wait(2)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("BreakTimeWindow").Exist(2)=False Then	
		Call func_reportStatus("Fail","Verify 'Break Time' Window","'Break Time' Window is NOT Opened")
		Call func_SetReturnCodeToZero()
	End If
	Call func_reportStatus("Pass","Verify 'Break Time' Window","'Break Time' Window is Opened")
	strBreakTimePrev = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("BreakTimePrev").Text)
	arrBreakTimePrev = Split(strBreakTimePrev,":")
	
	strBreakTimeStart_1 = arrBreakTimePrev(0)
	strBreakTimeStart_2 = arrBreakTimePrev(1)
	
	strBreakTimeEnd_1 = arrBreakTimePrev(0)
	strBreakTimeEnd_2 = CInt(arrBreakTimePrev(1))+30
	
	If strBreakTimeEnd_2 >= 60 Then
		strBreakTimeEnd_2= 60 - strBreakTimeEnd_2
		strBreakTimeEnd_1 = strBreakTimeEnd_1 + 1
	End If
	strBreakTimeStart_1 = func_SetToMaxFieldLength(strBreakTimeStart_1,2)
	strBreakTimeEnd_1 = func_SetToMaxFieldLength(strBreakTimeEnd_1,2)
	If Len(strBreakTimeEnd_2)=1 Then
		strBreakTimeEnd_2 = "0" & strBreakTimeEnd_2
	End If
	
	Call func_EnterValueInTeField("BIGDS001","BreakTimeStart_1",strBreakTimeStart_1)
	Call func_EnterValueInTeField("BIGDS001","BreakTimeStart_2",strBreakTimeStart_2)
	Call func_EnterValueInTeField("BIGDS001","BreakTimeEnd_1",strBreakTimeEnd_1)
	Call func_EnterValueInTeField("BIGDS001","BreakTimeEnd_2",strBreakTimeEnd_2)
	Call func_SendKey("ENTER")
	wait(2)
	
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
	intEndTimeFieldID = intRouteFieldID-8
	strEndTime = TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intEndTimeFieldID).GetROProperty("text")
	If UCase(strEndTime)=(strBreakTimeEnd_1 & ":" & strBreakTimeEnd_2) Then
		Call func_reportStatus("Pass","Verify Break Time Allocation","The Break Time is allocated successfully for the Route " & Environment.Value("Route"))
	Else
		Call func_reportStatus("Fail","Verify Break Time Allocation","The Break Time is NOT allocated successfully for the Route " & Environment.Value("Route"))
		Call func_SetReturnCodeToZero()
	End If	
End Function

Function func_DownTime()
	Call func_VerifyPreConditionForRouteAction()
	Call func_sendKey("D")
	Call func_sendKey("ENTER")
	wait(2)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("DownTimeWindow").Exist(2)=False Then	
		Call func_reportStatus("Fail","Verify 'Down Time' Window","'Down Time' Window is NOT Opened")
		Call func_SetReturnCodeToZero()
	End If
	Call func_reportStatus("Pass","Verify 'Down Time' Window","'Down Time' Window is Opened")
	strDownTimeOdometerPrev = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("DownTimeOdometerPrev").Text)
	strDownTimePrev = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("DownTimePrev").Text)
	arrDownTimePrev = Split(strDownTimePrev,":")
	
	strDownTimeStart_1 = arrDownTimePrev(0)
	strDownTimeStart_2 = arrDownTimePrev(1)
	
	strDownTimeEnd_1 = CInt(arrDownTimePrev(0))+1
	strDownTimeEnd_2 = arrDownTimePrev(1)
	
	If strDownTimeEnd_1 > 23 Then 'Hours Should NOT be exceeded 23. So subtracting from 23 here.
		strDownTimeEnd_1= 23 - strDownTimeEnd_1
		'strDownTimeEnd_2 = strDownTimeEnd_2 + 1
	End If
	strDownTimeStart_1 = func_SetToMaxFieldLength(strDownTimeStart_1,2)
	strDownTimeEnd_1 = func_SetToMaxFieldLength(strDownTimeEnd_1,2)
	If Len(strDownTimeEnd_2)=1 Then
		strDownTimeEnd_2 = "0" & strDownTimeEnd_2
	End If
	
	strDownTimeOdometerPrev = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("DownTimeOdometerPrev").Text)+1
	strDownTimeOdometerEnd = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("DownTimeOdometerPrev").Text)+31
	strDownTimeOdometerStart = strDownTimeOdometerPrev & ".0"
	strDownTimeOdometerEnd = strDownTimeOdometerEnd & ".0"
	strDownTimeOdometerStart = func_SetToMaxFieldLength(strDownTimeOdometerStart,8)
	strDownTimeOdometerEnd = func_SetToMaxFieldLength(strDownTimeOdometerEnd,8)
	
	
	Call func_EnterValueInTeField("BIGDS001","DownTimeStart_1",strDownTimeStart_1)
	Call func_EnterValueInTeField("BIGDS001","DownTimeStart_2",strDownTimeStart_2)
	Call func_EnterValueInTeField("BIGDS001","DownTimeEnd_1",strDownTimeEnd_1)
	Call func_EnterValueInTeField("BIGDS001","DownTimeEnd_2",strDownTimeEnd_2)
	Call func_EnterValueInTeField("BIGDS001","DownTimeOdometerStart",strDownTimeOdometerStart)
	Call func_EnterValueInTeField("BIGDS001","DownTimeOdometerEnd",strDownTimeOdometerEnd)
	
	Call func_SelectInputByHelp_OnScreen("BIGDS001","DownTimeReason",642)
	
	Call func_SendKey("ENTER")
	wait(2)
	
	
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
	intEndTimeFieldID = intRouteFieldID-8
	strEndTime = TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intEndTimeFieldID).GetROProperty("text")
	If UCase(strEndTime)=(strDownTimeEnd_1 & ":" & strDownTimeEnd_2) Then
		Call func_reportStatus("Pass","Verify Down Time Allocation","The Down Time is allocated successfully for the Route " & Environment.Value("Route"))
	Else
		Call func_reportStatus("Fail","Verify Down Time Allocation","The Down Time is NOT allocated successfully for the Route " & Environment.Value("Route"))
		Call func_SetReturnCodeToZero()
	End If
End Function


Function func_Replacement()
	Call func_VerifyPreConditionForRouteAction()
	Call func_sendKey("R")
	Call func_sendKey("ENTER")
	wait(2)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ReplaceTransactionWindow").Exist(2)=False Then	
		Call func_reportStatus("Fail","Verify 'Replace Transaction' Window","'Replace Transaction' Window is NOT Opened")
		Call func_SetReturnCodeToZero()
	End If
	strExistingDriver = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ExistingEmp-1").Text
	strReplacementTimePrev = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ReplacementTimePrev").Text
	strReplacementOdometerPrev = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ReplacementOdometerPrev").Text
	Call func_reportStatus("Pass","Existing Driver",strExistingDriver)
	Call func_reportStatus("Pass","Previous Time",strReplacementTimePrev)
	Call func_reportStatus("Pass","Previous Odometer",strReplacementOdometerPrev)
	arrReplacementTimePrev = Split(strReplacementTimePrev,":")
	strReplacementTimeStart_1 = arrReplacementTimePrev(0)
	strReplacementTimeStart_2 = arrReplacementTimePrev(1)
	strReplacementTimeEnd_1 = arrReplacementTimePrev(0)
	strReplacementTimeEnd_2 = CInt(arrReplacementTimePrev(1))+30
	If strReplacementTimeEnd_2 >= 60 Then
		strReplacementTimeEnd_2= 60 - strReplacementTimeEnd_2
		strReplacementTimeEnd_1 = strReplacementTimeEnd_1 + 1
	End If
	If Len(strReplacementTimeEnd_2)=1 Then
		strReplacementTimeEnd_2 = "0" & strReplacementTimeEnd_2
	End If
	strReplacementTimeStart_1 = func_SetToMaxFieldLength(strReplacementTimeStart_1,2)
	strReplacementTimeEnd_2 = func_SetToMaxFieldLength(strReplacementTimeEnd_2,2)
	strReplacementOdometer = Int(Trim(strReplacementOdometerPrev)) + 30
	strReplacementOdometer = strReplacementOdometer & ".0"
	strReplacementOdometer = func_SetToMaxFieldLength(strReplacementOdometer,8)
	TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ChangeEmp-1").SetCursorPos
	Call func_SendKey("F4")
	For intEmpFieldID = 486 To 1446 Step 240
		Set objStartEmpField = TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("field id:=" & intEmpFieldID)
		If objStartEmpField.Exist(1) Then
			If Trim(objStartEmpField.Text)<>Trim(strExistingDriver) Then
				strNewDriver = objStartEmpField.Text
				objStartEmpField.SetCursorPos
				Call func_SendKey("BACKTAB")
				wait(1)
				Call func_SendKey("1")
				Call func_SendKey("ENTER")
				wait(2)
				Exit For
			End If
		Else
			Call func_reportStatus("Fail","No Driver is availablet to Replace","")
			Call func_SetReturnCodeToZero()
		End If
		If intEmpFieldID=1446 and TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("text:=\+").Exist(1) Then
			Call func_SendKey("PAGEDOWN")
			intEmpFieldID = 1206
		End If
	Next
'	strNewDriver = func_SelectInputByHelp_OnScreen("BIGDS001","ChangeEmp-1",483)
	Call func_EnterValueInTeField("BIGDS001","ReplacementTimeStart_1",strReplacementTimeStart_1)
	Call func_EnterValueInTeField("BIGDS001","ReplacementTimeStart_2",strReplacementTimeStart_2)
	
	Call func_EnterValueInTeField("BIGDS001","ReplacementOdometer",strReplacementOdometer)
	Call func_EnterValueInTeField("BIGDS001","ReplacementRouteStartTime_1",strReplacementTimeEnd_1)
	Call func_EnterValueInTeField("BIGDS001","ReplacementRouteStartTime_2",strReplacementTimeEnd_2)
	Call func_EnterValueInTeField("BIGDS001","ReplacementOdometerChange",strReplacementOdometer)	
	Call func_SendKey("ENTER")
	wait(2)
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("ReplaceTransactionWindow").Exist(0) Then	
		Call func_reportStatus("Fail","Replace NOT done successfully","")
		Call func_SetReturnCodeToZero()
	End If
	Call func_sendKey("R")
	Call func_sendKey("ENTER")
	wait(2)
	
	If GetAndVerifyTeFieldValue("BIGDS001","ChangeEmp-1",strNewDriver) Then
		Call func_reportStatus("Pass","Verify New Driver","The Driver " & strExistingDriver & " has been replaced with " & strNewDriver)
	End If
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementRouteStartTime_1",strReplacementTimeStart_1)
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementRouteStartTime_2",strReplacementTimeStart_2)
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementOdometer",strReplacementOdometer)
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementRouteStartTime_1",strReplacementTimeEnd_1)
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementRouteStartTime_2",strReplacementTimeEnd_2)
'	Call GetAndVerifyTeFieldValue("BIGDS001","ReplacementOdometerChange",strReplacementOdometer)
	Call func_SendKey("F12")
End Function
	
Function func_CancelRoute()	
	Call func_SendKey("F23")
	Wait(2)
	If VerifyScreenHeader("CANCEL CREATED ROUTE SHEETS")=False Then
		Call func_SetReturnCodeToZero()
	End If
	
	If Environment.Value("Date")="" Then
		strEnteredDate = TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("Enter Date").Text
		strEnteredFormat = TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("Enter Format").Text
	Else
		strDate = Environment.Value("Date") 'Need to format the date
		Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","Enter Format",Environment.Value("Format"))
		Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","Enter Date",strDate)
	End If
	
	Call func_reportStatus("Pass","Entered Format",strEnteredFormat)
	Call func_reportStatus("Pass","Entered Date",strEnteredDate)
	Call func_SendKey("ENTER")
	
	If Environment.Value("Route")="" Then
		If TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("field id:=411").Exist(1) Then
			Environment.Value("Route") = TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("field id:=411").Text
			TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("field id:=411").SetCursorPos
		End If
	Else
		intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
		If intRouteFieldID>0 Then
			Call func_reportStatus("Pass","Search Route", "Route " & Environment.Value("Route") & " is available")
		Else
			Call func_reportStatus("Fail","Search Route", "Route " & Environment.Value("Route") & " is NOT available")
			Call func_SetReturnCodeToZero()
		End If
		TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("field id:=" & intRouteFieldID).SetCursorPos
	End If
	
	Call func_SendKey("BACKTAB")
	Call func_SendKey("1")
	wait(2)
	Call func_SendKey("F10")
	wait(1)
	If TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("EnterReasonWindow").Exist(2)=False Then					
		Call func_reportStatus("Fail","Verify 'Enter Reason' Window","'Enter Reason' Window has been opened")
		Call func_SetReturnCodeToZero()
	End If
	Call func_reportStatus("Pass","Verify 'Enter Reason' Window","'Enter Reason' Window has been opened")
	Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","EnterReason","DELETING THE ROUTE " & Environment.Value("Route"))
	Call func_SendKey("ENTER")
	wait(2)
	If TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("Warning").Exist(1) Then
		strWarning = TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("Warning").Text
		Call func_SendKey("F10")
		wait(1)
	End If
	
	Call func_SendKey("F5")
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
	If intRouteFieldID=0 Then
		Call func_reportStatus("Pass","Verify Deletion", "Route " & Environment.Value("Route") & " is deleted successfully")
	Else
		Call func_reportStatus("Fail","Verify Deletion", "Route " & Environment.Value("Route") & " is NOT deleted successfully")
	End If
End Function





Function func_UpdateLoad()	
	Environment.Value("Route")=""
	If Environment.Value("Route")="" Then
			intRouteFieldID = 0				
			intSLDFieldID = func_SearchItemInGrid("S-LD1",0)
			intULFieldID = func_SearchItemInGrid("U-LD1",0)
			
				If intSLDFieldID=0 Then 'If the Route not found with SLD status
					If intULFieldID=0 Then 'If the Route not found with FLD status
						
					Else
						intStatusFieldID = intULFieldID
						intRouteFieldID = intULFieldID + 15
					End If
				Else
					intStatusFieldID = intSLDFieldID
					intRouteFieldID = intSLDFieldID + 15
				End If
			
			If intRouteFieldID=0 Then
				Call func_reportStatus("Fail","No Route Found","No Route Found")
				Call func_SetReturnCodeToZero()
			Else
				Environment.Value("Route") = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intRouteFieldID).Text
				intLiftsFieldID = intRouteFieldID + 18
				str_lift = Trim(TEWindow("InfoProWindow").TEScreen("BIGDS001").TEField("field id:=" & intLiftsFieldID).GetROProperty("text"))
				Environment.Value("Lifts") = func_SetToMaxFieldLength(str_lift,5)
				strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).Text
				Call func_reportStatus("Pass","Route and Status","Found the Route '" & Environment.Value("Route") & "' with the '" & strStatus & "'")
				TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intRouteFieldID).SetCursorPos
				Call func_SendKey("BACKTAB")
			End If		
		Else
			strStatus = func_SetCursorOnRouteByNumberNStatus(Environment.Value("Route"),"")
			If NOT (strStatus="S-LD1" Or strStatus="U-LD1") Then
				Call func_reportStatus("Fail","Verify the Status","Status for the Route " & Environment.Value("Route") & " is Not Meeting the Pre-Condition. Actual:" & strStatus & ", Expected: S-LD1 or U-LD1")
				Call func_SetReturnCodeToZero()
			End If		
		End If	
	
	Call func_sendkey("U")
	Call func_sendkey("ENTER")
	wait(2)
	
	If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("LoadUpdateWindow").Exist(2)=False Then
		Call func_reportStatus("Fail","'Load Update' window","The 'Load Update' window is NOT available")
		Call func_SetReturnCodeToZero()
	End If
	
	Call func_reportStatus("Pass","'Load Update' window","The 'Load Update' window is available")
	
	strLoadUpdatePrev = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("LoadUpdatePrev").Text
	Call func_reportStatus("Pass","Load Updated Previous Time",strLoadUpdatePrev)
	arrLoadUpdatePrev = Split(strLoadUpdatePrev,":")
	strLoadUpdateTimeStart_1 = Int(arrLoadUpdatePrev(0))
	strLoadUpdateTimeStart_2 = Int(arrLoadUpdatePrev(1))
	
	
	strLoadUpdateTimeStart_2 = strLoadUpdateTimeStart_2+30
	If strLoadUpdateTimeStart_2 >= 60 Then
		strLoadUpdateTimeStart_2= "00"
		strLoadUpdateTimeStart_1 = strLoadUpdateTimeStart_1 + 1
	End If
	
	strLoadUpdateTimeStart_1 = func_SetToMaxFieldLength(strLoadUpdateTimeStart_1,2)
	strLoadUpdateTimeStart_2 = func_SetToMaxFieldLength(strLoadUpdateTimeStart_2,2)
	
	Environment.Value("Lifts") = func_SetToMaxFieldLength(Environment.Value("Lifts"),5)
	Call func_EnterValueInTeField("BIGDS001","LoadUpdateTime_1",strLoadUpdateTimeStart_1)
	Call func_EnterValueInTeField("BIGDS001","LoadUpdateTime_2",strLoadUpdateTimeStart_2)
	Call func_EnterValueInTeField("BIGDS001","LoadUpdateLifts",Environment.Value("Lifts"))
	Call func_SendKey("TAB")
	Call func_SendKey("ENTER")
	wait(2)
	strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intStatusFieldID).Text
	If strStatus<>"U-LD1" Then
		Call func_reportStatus("Fail","Verify the Status","Status for the Route " & Environment.Value("Route") & " is " & strStatus & ", Expected: U-LD1")	
		Call func_SetReturnCodeToZero()
	Else
		Call func_reportStatus("Pass","Verify the Status","Status for the Route " & Environment.Value("Route") & " is " & strStatus & ", Expected: U-LD1")
	End If	
End Function



