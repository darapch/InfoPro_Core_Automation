'Environment.Value("Route")="3101"
Environment.Value("DriverService") = "NOSERVICE"
Environment.Value("SplitValue") = "1"
Environment.Value("RootPath") = "C:\Users\darapch\Desktop\Automation\InfoPro_Automation\"
RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"




If VerifyScreenHeader("Driver Service - Select Stop")=False Then
	Call func_SetReturnCodeToZero()
End If


Function func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)
	Environment.Value("WSeq") = ""
	For intQtyFieldID = 507 to 1387 step 80
		Set objQtyField = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intQtyFieldID)				
		intStatusFieldID = intQtyFieldID-25
		intWseQFieldID = intQtyFieldID-10
		If objQtyField.Exist(1) Then
			strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).Text
			If strStatus="" or (strStatus<>"BLOCKD" and strStatus<>"TRANSF" and strStatus<>"NO-SER") Then					
				intQty = Int(Trim(objQtyField.Text))
				If intQty>=strLeastQty Then	
					Environment.Value("Qty") = intQty
'					Environment.Value("Qty") = func_SetToMaxFieldLength(Environment.Value("Qty"),5)
					strWSeq = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intWseQFieldID).Text
					Call func_reportStatus("Pass","W-Seq Number",strWSeq)
					strWSeq = func_SetToMaxFieldLength(strWSeq,5)
					Environment.Value("WSeq") = strWSeq
					TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intQtyFieldID).SetCursorPos
					Call func_sendkey("BACKTAB")
'					Call func_sendkey(strDriverServiceAction)
					wait(2)
					Exit For
				End If
				If intQtyFieldID=1387 and TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("text:=\+").Exist(3) Then
					intQtyFieldID = 427				
					Call func_sendkey("PAGEDOWN")
					wait(2)						
				End If
			End If
		Else
			Call func_reportStatus("Fail","No W-Seq Number Found","No W-Seq Number Found")
			Call func_SetReturnCodeToZero()
		End If
	Next
End Function



Select Case UCase(Environment.Value("DriverService"))
	Case "ADDITIONAL"
		strDriverServiceAction = "A"
		strLeastQty = 1
		Call func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)	
		Call func_sendkey(strDriverServiceAction)	
		Call func_sendkey("ENTER")
		wait(2)		
		strCustomerName = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("CustomerName").GetROProperty("text")
		Call func_reportStatus("Done","Customer Name",strCustomerName)
		Call func_EnterValueInTeField("BIGDS026_Driver Service","Qty","2")
		Call func_sendkey("ENTER")
		While TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("text:=\+").Exist(3)
			Call func_sendkey("PAGEDOWN")
		Wend
		Call SetEmulatorStatusToReady()
		intIndex = GetChildObjectCountByText(strCustomerName)
		intCustomerFieldID = func_SearchItemInGrid(strCustomerName,intIndex-1)
		
		If intCustomerFieldID>0 Then
			intStatusFieldID = intCustomerFieldID-41
			strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
			If Trim(strStatus)="ADDTNL" Then
				Call func_reportStatus("Pass","Verify the Status","The Status has been changed to " & strStatus)
			Else
				Call func_reportStatus("Fail","Verify the Status","The Status has NOT been changed to ADDTNL. Displaying as " & strStatus)
			End If
		End If
			
	
	Case "SPLIT"
		strDriverServiceAction = "X"		
		strLeastQty = 2
		Call func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)				
		intCountBeforeSplit = GetChildObjectCountByText(Environment.Value("WSeq"))						
		Call func_reportStatus("Done","W-Seq # '" & Environment.Value("WSeq") & "'","W-Seq # '" & Environment.Value("WSeq") & "' has the Qty " & Environment.Value("Qty"))
		Call func_sendkey(strDriverServiceAction)
		Call func_sendkey("ENTER")
		wait(2)
		
		Call func_EnterValueInTeField("BIGDS026_Driver Service","Split",Environment.Value("SplitValue"))
		Call func_sendkey("ENTER")
		wait(2)
		Call func_EnterValueInTeField("BIGDS026_Driver Service","WSeq",Environment.Value("WSeq"))
		Call func_sendkey("ENTER")
		wait(2)
		
		intCountAfterSplit = GetChildObjectCountByText(Environment.Value("WSeq"))
		If intCountAfterSplit-intCountBeforeSplit=1 Then
			Call func_reportStatus("Pass","Verification of Split","The Split is Done Successfully")
			intSpaces = 4-Environment.Value("SplitValue")
			Environment.Value("SplitValue")=Space(intSpaces) & Environment.Value("SplitValue")
			If func_SearchItemInGrid(Environment.Value("SplitValue"),0)>0 Then
				Call func_reportStatus("Pass","Verify Splitted I","The First Part of the Split is Done to " & Trim(Environment.Value("SplitValue")))
			Else
				Call func_reportStatus("Fail","Verify Splitted I","The First Part of the Split is NOT Done to " & Trim(Environment.Value("SplitValue")))
			End If
			
			If func_SearchItemInGrid(Environment.Value("SplitValue"),1)>0 Then
				Call func_reportStatus("Pass","Verify Splitted II","The Second Part of the Split is Done to " & Environment.Value("Qty")-Int(Trim(Environment.Value("SplitValue"))))
			Else
				Call func_reportStatus("Fail","Verify Splitted II","The Second Part of the Split is NOT Done to " & Environment.Value("Qty")-Int(Trim(Environment.Value("SplitValue"))))
			End If					
		Else
			Call func_reportStatus("Fail","Verification of Split","The Split is NOT Done Successfully")
		End If
	
				
		
	Case "TRANS"
		strDriverServiceAction = "T"		
		strLeastQty = 2
		Call func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)
		Call func_sendkey(strDriverServiceAction)	
		Call func_sendkey("ENTER")
		wait(2)
		Environment.Value("ToRoute")=""
		Call SetEmulatorStatusToReady()
		Call func_sendkey("ENTER")
		intFMTTypeFieldID = func_SearchItemInGrid("C",0)
		If intFMTTypeFieldID>0 Then
			intToRouteFieldID = intFMTTypeFieldID-16				
			Environment.Value("ToRoute") = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intToRouteFieldID).Text
			Call func_reportStatus("Pass","To Route",Environment.Value("ToRoute"))
			TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intToRouteFieldID).SetCursorPos
			Call func_sendkey("BACKTAB")
			wait(1)
			Call func_sendkey("1")
			wait(1)
			Call func_sendkey("ENTER")
			wait(2)
			
			intWSeqFieldID = func_SearchItemInGrid(Environment.Value("WSeq"),0)
			If intWSeqFieldID>0 Then
				intStatusFieldID = intWSeqFieldID-15
				Call func_sendkey("F5")
				wait(2)
				Call func_sendkey("F5")
				wait(2)
				intWSeqFieldID = func_SearchItemInGrid(Environment.Value("WSeq"),0)
				intStatusFieldID = intWSeqFieldID-15
				strChangedStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).Text
				If strChangedStatus="TRANSF" Then
					Call func_reportStatus("Pass","Verify Changed Status",strChangedStatus)
				Else
					Call func_reportStatus("Fail","Verify Changed Status","Changed to " & strChangedStatus & ". Expected is TRANSF")
				End If
			End If
		Else
			Call func_reportStatus("Fail","To Route","No Route Found to Transfer")
			Call func_SetReturnCodeToZero()
		End If
	Case "SUPPLEMENTAL"
			strDriverServiceAction = "S"
			strLeastQty=1
			Call func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)
			Call func_sendkey(strDriverServiceAction)	
			Call func_sendkey("ENTER")
			wait(2)
			
			Environment.Value("Service") = "BUL"
			Environment.Value("Quantity") = "1"
			Environment.Value("Quantity") = func_SetToMaxFieldLength(Environment.Value("Quantity"),6)

			strCustomerName = TeWindow("InfoProWindow").TeScreen("BIGDS027_SUPPLEMENTAL SERVICES").TeField("SiteName").GetROProperty("text")
			Call func_reportStatus("Done","Customer Name",strCustomerName)
			
			intServiceFieldID = func_SearchItemInGrid(Environment.Value("Service"),0)
			If intServiceFieldID=0 Then
				Call func_reportStatus("Fail","Service NOT Found","The Service '" & Environment.Value("Service") & "' is NOT found")
				Call func_SetReturnCodeToZero()
			End If
			intQtyFieldID = intServiceFieldID+51
			TeWindow("InfoProWindow").TeScreen("BIGDS027_SUPPLEMENTAL SERVICES").TeField("field id:=" & intQtyFieldID).Set Environment.Value("Quantity")
			Call func_sendkey("ENTER")
			wait(2)
			While TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("text:=\+").Exist(3)
				Call func_sendkey("PAGEDOWN")
			Wend
			Call SetEmulatorStatusToReady()
			intIndex = GetChildObjectCountByText(strCustomerName)
			intCustomerFieldID = func_SearchItemInGrid(strCustomerName,intIndex-1)
			
			If intCustomerFieldID>0 Then
				intStatusFieldID = intCustomerFieldID-41
				strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
				If Trim(strStatus)="SUPPLM" Then
					Call func_reportStatus("Pass","Verify the Status","The Status has been changed to " & strStatus)
				Else
					Call func_reportStatus("Fail","Verify the Status","The Status has NOT been changed to SUPPLM. Displaying as " & strStatus)
				End If
			End If

	Case "BLOCK","NOSERVICE"
			If UCase(Environment.Value("DriverService"))="BLOCK" Then
				strDriverServiceAction = "B"
				strPostStatus = "BLOCKD"
				strText = "Blocking the Seq # "
			ElseIf UCase(Environment.Value("DriverService"))="NOSERVICE" Then
				strDriverServiceAction = "N"
				strPostStatus = "NO-SER"
				strText = "No Service for Seq # "
			End If
			
			strLeastQty=1
			Call func_sendkey("F5")
			wait(2)
			Call func_SearchWSeqNServe(strLeastQty,strDriverServiceAction)
			Call func_sendkey(strDriverServiceAction)	
			Call func_sendkey("ENTER")
			wait(2)	
			If VerifyScreenHeader("Missed  Stops")=False Then
				Call func_SetReturnCodeToZero()
			End If
			strCustomer = TeWindow("InfoProWindow").TeScreen("BIGDS036_Missed  Stops").TeField("Customer").Text	
			strSite = TeWindow("InfoProWindow").TeScreen("BIGDS036_Missed  Stops").TeField("Site").Text
			strContact = TeWindow("InfoProWindow").TeScreen("BIGDS036_Missed  Stops").TeField("Contact").Text
			Call func_reportStatus("Pass","Customer",strCustomer)
			Call func_reportStatus("Pass","Site",strSite)
			Call func_reportStatus("Pass","Contact",strContact)
			Call func_EnterValueInTeField("BIGDS036_Missed  Stops","Text",strText & Environment.Value("WSeq"))
			Environment.Value("Qty") = func_SetToMaxFieldLength(Environment.Value("Qty"),3)
			Call func_EnterValueInTeField("BIGDS036_Missed  Stops","Miss",Environment.Value("Qty"))
			If UCase(Environment.Value("DriverService"))="BLOCK" Then				
				Call func_EnterValueInTeField("BIGDS036_Missed  Stops","Rtry","N")
				Call func_EnterValueInTeField("BIGDS036_Missed  Stops","Rrte","Y")
			End If
			
			If TeWindow("InfoProWindow").TeScreen("BIGDS036_Missed  Stops").TeField("Reason").Text="" Then
				Call func_EnterValueInTeField("BIGDS036_Missed  Stops","Reason","B")				
			End If
			
			Call func_sendkey("ENTER")
			wait(2)	
			Call func_sendkey("F5")
			wait(2)
			Call func_EnterValueInTeField("BIGDS026_Driver Service","WSeq",Environment.Value("WSeq"))
			Call func_sendkey("ENTER")
			wait(2)
			Call SetEmulatorStatusToReady()
			intWSeqFieldID = func_SearchItemInGrid(Environment.Value("WSeq"),0)
			
		
			If intWSeqFieldID>0 Then
				intStatusFieldID = intWSeqFieldID-15
				strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
				If Trim(strStatus)=strPostStatus Then
					Call func_reportStatus("Pass","Verify the Status","The Status has been changed to " & strStatus)
				Else
					Call func_reportStatus("Fail","Verify the Status","The Status has NOT been changed to " & strPostStatus & ". Displaying as " & strStatus)
				End If
			End If
End Select





			
			
			
