import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"



function CreateAccount(){
  return(
    <div className="content px-4">
      <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-6 w-6 mb-2"/>
        <AlertTitle>WARNING</AlertTitle>
        <AlertDescription>
          Once you generate a seed phrase, you will need to write it down and keep it safe.
          <br></br>
          If you lose your seed phrase, you will lose access to your funds.
        </AlertDescription>
      </Alert>
      <Button 
      className="mt-6 mb-5 bg-sky text-blackest w-8/12"
      //onClick={() => generateWallet()}
      >
        Generate Seed Phrase
      </Button>
      <Card className="w-full min-h-[160px] mt-1 bg-black border-amber text-offwhite p-2">
        test test test
      </Card>
      
    </div>
  );
}

export default CreateAccount;