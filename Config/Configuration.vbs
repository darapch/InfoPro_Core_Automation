
LoadFunctionLibrary Environment.Value("RootPath") & "FunctionLibrary\GenericFunction.qfl"
LoadFunctionLibrary Environment.Value("RootPath") & "FunctionLibrary\ReportingFunction.qfl"
LoadFunctionLibrary Environment.Value("RootPath") & "FunctionLibrary\Result Functions.vbs"

If RepositoriesCollection.Find(Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr")=-1 Then
	RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"
End If



'Driver
	Environment.Value("ErrorScreenshot") = ""
	Environment.Value("UName") = ""
	Environment.Value("Password") = ""
	Environment.Value("QuoteNum") = ""
	Environment.Value("AccountNumber") = ""
	Environment.Value("TrimAccountNumber") = ""
	Environment.Value("OrderNum") = ""
	Environment.Value("DivisionNumber") = ""
	Environment.Value("ProjectId") = ""
	Environment.Value("DivisionCode") = ""
	Environment.Value("PrimarySelection") = ""
	Environment.Value("SecondarySelection") = ""
	Environment.Value("StreetName") = ""
	Environment.Value("Result") = ""

	
	'BIGAA001
	Environment.Value("BIGAA001Fields") = ""
	Environment.Value("BIGAA001PrintFeeFields") = ""
	Environment.Value("ShipmentId") = ""
	Environment.Value("ZipCode") = ""
	Environment.Value("WeightCode") = ""
	
	'BIGAA014
	Environment.Value("BIGAA014Fields") = ""
	Environment.Value("ITEM_CODE") = ""
	
	'RateValidation
	Environment.Value("CHARGECODE") = ""
	Environment.Value("CHARGECODE2") = ""
	Environment.Value("TERM") = ""
	
	'CREATEACCOUNT
	Environment.Value("ACCOUNTNUMBER") = ""
	
	'BIDDS035
	Environment.Value("BIDDS035Fields") = ""
	Environment.Value("CSPOTemp") = ""
	Environment.Value("BIDDS035FieldsCount") = ""
	
	'BIGDS024
	Environment.Value("BIGDS024Selection") = ""
	Environment.Value("BIGDS024Reason") = ""
	
	'BIGDS024Processed
	Environment.Value("BIGDS024PageCount") = ""
	
	'BIGRS033"
	Environment.Value("RoutingDate") = ""
	Environment.Value("Route") = ""


	Environment.Value("FetchAccDetailsFromDB")=False
	Environment.Value("returncode") = 1
	Environment.Value("is_batchrun") = False