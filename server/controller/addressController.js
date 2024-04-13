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

// const Editaddress = async(req,res)=>{
//     try {
//         const{fname,lname,mobile,email,address,place,pin} = req.body;
//         const id = req.query.id
//         // const edit = await Address.findById(id)
//         // res.render('editaddress',{ edit })
//         const editaddress = await Address.findOneAndUpdate({
//             user:req.session.UserId,'addresses._id':id
//         },
//         {$set:{
//             "addresses.$fname":req.body.fname,
//             "addresses.$lname":req.body.lname,
//             "addresses.$email":req.body.email,
//             "addresses.$mobile":req.body.mobile,
//             "addresses.place":req.body.place,
//             "addresses.pin":req.body.pin,
//         },},

//         res.json({success:true})
//     )

//     } catch (error) {
//         console.log(error.message)
//     }
// };

const Editaddress = async (req, res) => {
    try {
        const { fname, lname, mobile, email, address, place, pin, id } = req.body;
        const userId = req.session.UserId;

        console.log(id,"yfyrey")

        const user = await Address.findOne({ user: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        const addressToUpdate = user.addresses.find(addr => addr._id.toString() === id);
        if (!addressToUpdate) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        addressToUpdate.fname = fname;
        addressToUpdate.lname = lname;
        addressToUpdate.email = email;
        addressToUpdate.mobile = mobile;
        addressToUpdate.address = address;
        addressToUpdate.place = place;
        addressToUpdate.pin = pin;

        await user.save();
        
      res.redirect("/profile")
    } catch (error) {
        console.error("Error editing address:", error);
        res.status(500).json({ success: false, message: "Error editing address" });
    }
};




const deleteaddress = async(req,res)=>{
    try {
        const userid = req.session.UserId
        const id = req.query.id
        console.log(id,"delete addres id")
        const addressdelete = await Address.updateOne(
            {user:userid},
            {$pull:{addresses:{_id:id}}}
            ,{new:true}
        )
    
        res.redirect('/profile')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    useraddress,
    Editaddress,
    
    deleteaddress
}