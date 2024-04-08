const Address = require('../model/AddressModel')

const useraddress = async(req,res)=>{
    try {
        const { fname,lname,email,mobile,address,place,pin} = req.body
        console.log("the fname ",fname);
        const userid = req.session.UserId
        console.log("user is",userid);

        const addaddress = await Address.findOneAndUpdate({
            user:userid },
       {
        $push:{
            addresses:{
                fname:fname,
                lname:lname,
                email:email,
                mobile:mobile,
                address:address,
                place:place,
                pin:pin
            }
        }
       },
       {new:true,upsert:true}

        )
        console.log("addrss added");


        res.redirect("/profile")
    } catch (error) {
        console.log(error)
        // Send a response back to the client indicating that there was an error
        res.status(500).send('An error occurred while adding the address.')
    }
}

const Editaddress = async(req,res)=>{
    try {
        const id = req.query.id
        const edit = await Address.findById(id)
        res.render('editaddress',{ edit })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    useraddress,
    Editaddress
}