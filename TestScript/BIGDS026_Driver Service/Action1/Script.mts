Environment.Value("Route")="6990"
Environment.Value("DriverService") = "trans"
Environment.Value("SplitValue") = "additional"

Select Case UCase(Environment.Value("DriverService"))
	Case "ADDITIONAL"
		strDriverServiceAction = "A"
		intWSeqFieldID = 497
		If TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("DriverServiceSelectStop").Exist(5) Then
			Call func_reportStatus("Pass","Verify the 'Driver Service - Select Stop' screen","The 'Driver Service - Select Stop' screen is available")
			If GetAndVerifyTeFieldValue("BIGDS026_Driver Service","RoutePosition",Environment.Value("Route")) Then
				Call func_reportStatus("Pass","Verify the Displayed Route","The displayeing Route is " & Environment.Value("Route"))
				Call func_sendkey("F5")
				wait(1)		
				TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intWSeqFieldID).SetCursorPos
				Call func_sendkey("BACKTAB")
				Call func_sendkey(strDriverServiceAction)
				Call func_sendkey("ENTER")
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
			Else
				Call func_reportStatus("Fail","Verify the Displayed Route","The displayeing Route is NOT " & Environment.Value("Route"))
			End If
		Else
			Call func_reportStatus("Fail","Verify the 'Driver Service - Select Stop' screen","The 'Driver Service - Select Stop' screen is NOT available")
		End If
	Case "SPLIT"
		strDriverServiceAction = "X"
		strWSeqValue = ""
		For intQtyIndex = 507 To 1387 Step 80			
			Set objQtyField = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intQtyIndex)
			If objQtyField.Exist(1) Then
				intQty = CInt(Trim(objQtyField.GetROProperty("text")))
				If intQty>1 Then					
					intStatusFieldID = intQtyIndex-25
					strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
					If Trim(strStatus)="CALLIN" Then
						intWSeqFieldID = intQtyIndex-10
						intSelFieldID = intQtyIndex-12
			
						Call func_sendkey("PAGEUP") 'Work Around. Actually need not.
						wait(1)
						Call SetEmulatorStatusToReady()
						TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intSelFieldID).Set strDriverServiceAction
						strWSeqValue = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intWSeqFieldID).GetROProperty("text")
						intCountBeforeSplit = GetChildObjectCountByText(strWSeqValue)						
						Call func_reportStatus("Done","W-Seq # '" & strWSeqValue & "'","W-Seq # '" & strWSeqValue & "' has the Qty " & intQty)
						Call func_sendkey("ENTER")
						Call func_EnterValueInTeField("BIGDS026_Driver Service","Split",Environment.Value("SplitValue"))
						Call func_sendkey("ENTER")
						Call func_EnterValueInTeField("BIGDS026_Driver Service","WSeq",strWSeqValue)
						Call func_sendkey("ENTER")
						intCountAfterSplit = GetChildObjectCountByText(strWSeqValue)
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
								Call func_reportStatus("Pass","Verify Splitted II","The Second Part of the Split is Done to " & intQty-Int(Trim(Environment.Value("SplitValue"))))
							Else
								Call func_reportStatus("Fail","Verify Splitted II","The Second Part of the Split is NOT Done to " & intQty-Int(Trim(Environment.Value("SplitValue"))))
							End If
							
						Else
							Call func_reportStatus("Fail","Verification of Split","The Split is NOT Done Successfully")
						End If
						Exit For
					End If
				End If
			Else
'				intQtyIndex = 1467
				Exit For				
			End If
			If intQtyIndex>=1387 and TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("text:=\+").Exist(3) Then
				intQtyIndex = 427
				Call func_sendkey("PAGEDOWN")
'				wait(0.5)
			End If
		Next
		If strWSeqValue="" Then
			Call func_reportStatus("Fail","No W-Seq # Found","No W-Seq Found with the Qty more than 1. Hence Unable to Split")
		End If
	Case "TRANS"
		strDriverServiceAction = "T"
		intStatusFieldID = 482
'		TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intWSeqFieldID)
'		TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).SetCursorPos
'		Call func_sendkey("TAB")
'		Call func_sendkey(strDriverServiceAction)
'		Call func_sendkey("ENTER")

		For intIndex = intStatusFieldID To intStatusFieldID+880 Step 80			
			Set objStatusField = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intIndex)
			If objStatusField.Exist(1) Then
				strStatus = Trim(objStatusField.GetROProperty("text"))
				If strStatus="CALLIN" Then
					intWSeqFieldID = intIndex+15
					strWSeqNo = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intWSeqFieldID).GetROProperty("text") 
					Call func_reportStatus("Pass","W-Seq No #","W-Seq No # " & strWSeqNo)
					objStatusField.SetCursorPos
					Call func_sendkey("TAB")
					intSelFieldID = intIndex+13
					TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intSelFieldID).Set strDriverServiceAction
					Call func_sendkey("ENTER")
					Call func_sendkey("1")
					Call func_sendkey("ENTER")
					Call func_EnterValueInTeField("BIGDS026_Driver Service","WSeq",strWSeqNo)
					Call func_sendkey("ENTER")
					Call func_sendkey("F5")
					intWSeqCount = GetChildObjectCountByText(strWSeqNo)
					intStatusFieldID = 482
					blnTransferStatus = False
					For intCount = 0 To intWSeqCount-1
						strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
						If strStatus="TRANSF" Then
							Call func_reportStatus("Pass","Verify Transfer","The Transfer is successfully Done")
							blnTransferStatus = True
							Exit For
						End If
					Next
					If blnTransferStatus Then
						Exit For
					End If
				End If
			End If
			If intIndex>=intStatusFieldID+880 and TeWindow("InfoProWindow").TeScreen("BIGDS026_Driver Service").TeField("text:=\+").Exist(3) Then
				intIndex = intStatusFieldID-80
				Call func_sendkey("PAGEDOWN")
'				wait(0.5)
			End If
		Next
End Select






