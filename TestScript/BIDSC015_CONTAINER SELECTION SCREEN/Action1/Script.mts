
'If TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerSelectionScreen").Exist(4) Then
'	Call func_reportStatus("Pass", "Verify Container Selection Screen","Container Selection Screen is displayed")
'Else
'	Call func_reportStatus("Fail", "Verify Container Selection Screen","Container Selection Screen is NOT displayed")
'	ExitTest
'End If
'
'Environment.Value("SiteNumber") = "00001"
'Environment.Value("ContainerGroup") = "5"
'Environment.Value("Status") = "ACTIVE"
'
'If Len(Environment.Value("ContainerGroup"))=1 Then
'	Environment.Value("ContainerGroup") = Space(1) & Environment.Value("ContainerGroup")
'ElseIf Len(Environment.Value("ContainerGroup"))>2 Then
'	Call func_reportStatus("Fail", "Verify Container Group Input","The Entered Container Group has Invalid length of " & Len(Environment.Value("ContainerGroup")))	
'End If
'
'TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").SetTOProperty "text",Environment.Value("ContainerGroup")
'blnFound = func_SearchItemInGrid(Environment.Value("ContainerGroup"))
'If blnFound Then
'	Call func_reportStatus("Pass", "Search the Container Group " & strText,"Found the Container Group " & Environment.Value("ContainerGroup"))
'	intContainerGroupFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").GetROProperty("field id")
'Else
'	Call func_reportStatus("Fail", "Search the Container Group " & strText,"NOT Found the Container Group " & Environment.Value("ContainerGroup"))
'	ExitTest
'End If



On Error Resume Next

'Environment.Value("Site") = "00103"
'Environment.Value("ContainerGroup") = "2"
'Environment.Value("Action") = "1"



Environment.Value("Site") = func_SetToMaxFieldLength(Environment.Value("Site"),5)
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("CONTAINER SELECTION SCREEN") Then	
	Call func_EnterValueInTeField("BIDSC015_ContainerSelectionScreen","Locate Site",Environment.Value("Site"))
	Call func_sendkey("ENTER")
	intSiteFieldID = func_SearchItemInGrid(Environment.Value("Site"),0)
	
	If intSiteFieldID>0 Then		
		Call func_reportStatus("Pass","Verify Site","The Site '" & Environment.Value("Site") & "' is available")
		intContainerGroupFieldID = func_SearchItemInGrid(Environment.Value("ContainerGroup"),0)
		
		
		If intContainerGroupFieldID>0 Then
			Call func_reportStatus("Pass","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is available at 'CONTAINER SELECTION SCREEN'")
			TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("field id:=" & intContainerGroupFieldID).SetCursorPos
			Call func_sendkey("BACKTAB")
			Call func_sendkey(Environment.Value("Action"))
			Call func_sendkey("ENTER")
			'Commented for time being
			'*************************************
			'			wait(1)
			'			If TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("StatusMsg").Exist(2) Then
			'				If TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("StatusMsg").GetROProperty("text")<>"" Then
			'					Call func_reportStatus("Fail","Verify Status Message",TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("StatusMsg").GetROProperty("text"))
			'					Call func_SetReturnCodeToZero()
			'				End If				
			'			End If
			'*************************************			
		Else
			
			Call func_reportStatus("Fail","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is NOT available at 'CONTAINER SELECTION SCREEN'")
			func_SetReturnCodeToZero()
		End If
	Else
		Call func_reportStatus("Fail","Verify Site","The Site '" & Environment.Value("Site") & "' is NOT available")		
		func_SetReturnCodeToZero()
	End If
Else
	func_SetReturnCodeToZero()
End If




'intSiteFieldID = intContainerGroupFieldID - 9
'intStatusFieldID = intContainerGroupFieldID + 6
'strSite = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("field id:=" & intSiteFieldID).GetROProperty("text")
'strStatus = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
'strContainerGroup = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").GetROProperty("text")
'
'
'
'If UCase(strSite)=UCase(Environment.Value("SiteNumber")) Then
'	Call func_reportStatus("Pass", "Verify Site","The Site " & Environment.Value("SiteNumber") & " is Found")
'	If UCase(strContainerGroup)=UCase(Environment.Value("ContainerGroup")) Then
'		Call func_reportStatus("Pass", "Verify Container Group","The Container Group " & Environment.Value("ContainerGroup") & " is Found")
'		If UCase(strStatus)=Environment.Value("Status") Then
'			Call func_reportStatus("Pass", "Verify Container Status","The Container with the Status '" & Environment.Value("Status") & "' is Found")	
'			TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").SetCursorPos
'			Call func_SendKey("BACKTAB")
'			Call func_SendKey("SELECT")			
'		Else
'			Call func_reportStatus("Fail", "Verify Container Status","The Container with the Status '" & Environment.Value("Status") & "' is NOT Found. The Status Found : " & strStatus)	
'		End If
'	Else
'		Call func_reportStatus("Fail", "Verify Container Group","The Container Group " & Environment.Value("ContainerGroup") & " is NOT Found")
'		ExitTest
'	End If
'Else
'	Call func_reportStatus("Fail", "Verify Site","The Site " & Environment.Value("SiteNumber") & " is NOT Found")
'	ExitTest
'End If
'





	
	
	
	
	
	
