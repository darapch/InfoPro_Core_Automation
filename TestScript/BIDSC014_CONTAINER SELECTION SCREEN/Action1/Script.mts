
On Error Resume Next

'Environment.Value("Site") = "00101"
'Environment.Value("ContainerGroup") = "2"
'Environment.Value("Action") = "R"

Environment.Value("Site") = func_SetToMaxFieldLength(Environment.Value("Site"),5)
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("CONTAINER SELECTION SCREEN") Then
	Call func_EnterValueInTeField("BIDSC014_CONTAINER SELECTION SCREEN","Locate Site",Environment.Value("Site"))
	Call func_sendkey("ENTER")
	If func_SearchItemInGrid(Environment.Value("Site"),0)>0 Then		
		Call func_reportStatus("Pass","Verify Site","The Site '" & Environment.Value("Site") & "' is available")
		intContainerGroupFieldID = func_SearchItemInGrid(Environment.Value("ContainerGroup"),0)
		If intContainerGroupFieldID>0 Then
			Call func_reportStatus("Pass","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is available at 'CONTAINER SELECTION SCREEN'")
			TeWindow("InfoProWindow").TeScreen("BIDSC014_CONTAINER SELECTION SCREEN").TeField("field id:=" & intContainerGroupFieldID).SetCursorPos
			Call func_sendkey("BACKTAB")
			Call func_sendkey(Environment.Value("Action"))
			Call func_sendkey("ENTER")
			wait(1)
			If TeWindow("InfoProWindow").TeScreen("BIDSC014_CONTAINER SELECTION SCREEN").TeField("StatusMsg").Exist(2) Then
				If TeWindow("InfoProWindow").TeScreen("BIDSC014_CONTAINER SELECTION SCREEN").TeField("StatusMsg").GetROProperty("text")<>"" Then
					Call func_reportStatus("Fail","Verify Status Message",TeWindow("InfoProWindow").TeScreen("BIDSC014_CONTAINER SELECTION SCREEN").TeField("StatusMsg").GetROProperty("text"))
					Call func_SetReturnCodeToZero()
				End If				
			End If			
		Else
			Call func_reportStatus("Fail","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is NOT available at 'CONTAINER SELECTION SCREEN'")
			func_SetReturnCodeToZero()
		End If
	Else
		Call func_reportStatus("Fail","Verify Site","The Site '" & Environment.Value("Site") & "' is NOT present at the Grid in 'BIDSC014_CONTAINER SELECTION SCREEN'")
		func_SetReturnCodeToZero()
	End If
Else
	func_SetReturnCodeToZero()
End If


	




