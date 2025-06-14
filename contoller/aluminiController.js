import uuid4 from "uuid4";

export const aluminiRegistrationController = (request,response)=>{
    try{
        request.body.aluminiId = uuid4();
        // console.log(request.files);
        // console.log(request.body);
    }
    catch(error){
        console.log("error while adding data");
    }
}