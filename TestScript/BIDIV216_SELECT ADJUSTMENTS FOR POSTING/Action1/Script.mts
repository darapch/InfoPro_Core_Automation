




If TeWindow("InfoProWindow").TeScreen("BIDIV216_SelectAdjustmentsForPosting").TeField("SELECT ADJUSTMENTS FOR POSTING").Exist(5) Then
	Call func_reportStatus("Pass", "Verify 'SELECT ADJUSTMENTS FOR POSTING' Screen", "The 'SELECT ADJUSTMENTS FOR POSTING' Screen is available")
Else
	Call func_reportStatus("Fail", "Verify 'SELECT ADJUSTMENTS FOR POSTING' Screen", "The 'SELECT ADJUSTMENTS FOR POSTING' Screen is NOT available")
	ExitTest
End If

intAccountFieldID = func_SearchItemInGrid(strAccountID)

If intAccountFieldID>0 Then
	Call func_reportStatus("Pass", "Verify the account " & strAccountID, "The account " & strAccountID & " is available")
Else
	Call func_reportStatus("Fail", "Verify the account " & strAccountID, "The account " & strAccountID & " is NOT available")
End If

