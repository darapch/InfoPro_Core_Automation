Dim str_DCQODelActReq
Dim str_compStringDCQO

str_DCQODelActReq = "QUANTITY"
str_compStringDCQO = str_DCQODelActReq

str_DCCOStartDate = "REQ_START_DATE"
str_DCCONotes = "DELIVERY_NOTES"
str_compStringDCCO = str_DCCOStartDate&":"&str_DCCONotes

Call func_setScreenProperty("BIGAA014_Override")
Wait(2)

If (TEWindow("InfoProWindow").TEScreen("BIGAA014_Override").TEField("DelContQtyOverride").Exist(5)) Then
	Call func_reportStatus("PASS", "Deliver Container/Quantity Overide Window", "Deliver Container/Quantity Overide Window Screen exists")
	Call func_compData("BIGAA014_Override", str_compStringDCQO, "CUPLINE")

	Call func_SendKey("ENTER")
	Wait(5)

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Deliver Container/Quantity Overide Window", "Deliver Container/Quantity Overide Window Screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014_Override").TEField("DelContQtyOverride").Exist(5)) Then

If (TEWindow("InfoProWindow").TEScreen("BIGAA014_Override").TEField("DelContConfOverride").Exist(5)) Then
	Call func_reportStatus("PASS", "Deliver Container/Confirm Overide Window", "Deliver Container/Confirm Overide Window Screen exists")
	Call func_compData("BIGAA014_Override", str_compStringDCCO, "CUPLINE")

	Call func_SendKey("ENTER")
	Wait(5)

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Deliver Container/Confirm Overide Window", "Deliver Container/Confirm Overide Window Screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014_Override").TEField("DelContConfOverride").Exist(5)) Then