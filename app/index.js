require("dotenv").config()

const express = require("express");
const app = express();
const cors = require("cors")
// const mongoose = require("mongoose")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const UserModel = require("./models/Users")
app.use(express.json())
app.use(cors())

// const { DB_URL } = process.env

// mongoose.connect(DB_URL)

// app.post("/createUser", async (req, res) => {
//     const user = req.body;
//     const newUser = new UserModel(user);
//     await newUser.save()

//     res.json(user)
// })

// app.get("/getUsers", (request, response) => {
//     UserModel.find({}, (err, result) => {
//         if (!err) {
//             response.json(result)
//         } else {
//             response.json(err)
//         }
//     })
// })

// app.put("/updateUser", (req, res) => {

//     const { id, name, age } = req.body

//     try {
//         UserModel.findById(id, (err, user) => {
//             console.log(user)
//             user.name = name
//             user.age = age
//             user.save()
//             res.send("User has been successfully updated in DB")
//         })
//     }
//     catch (err) {
//         res.send("Getting error from server")
//     }
// })

// app.delete("/deleteUser/:id", async (req, res) => {
//     const id = req.params.id

//     await UserModel.findByIdAndRemove(id).exec()
//     res.send("User has been successfully deleted from DB")
// })


const stripe = require('stripe')('sk_test_51MRD0iJnhTeigvQcqSxOC1kbEkx1zgGeMDfBFbqXHtlhJOgXehMaveYPyyqOfsQPa8jtHmk7pmjeosk3xpI8IUlR008LMNJOMM')
app.post('/payment', async (req, res) => {
  const { name, price, slug, bookingId } = req.body;
  // console.log("name =>", name)
  // console.log("price =>", price)
  // console.log("slug =>", slug)
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'sgd',
        product_data: {
          name,
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: "1",
    }],
    mode: 'payment',
    success_url: `${process.env.PORT_URL}/${slug}/booking/success?${bookingId}`,
    cancel_url: `${process.env.PORT_URL}/${slug}/booking/failed?${bookingId}`,
  });
  res.json({ url: session.url })
});


app.post("/sendEmail", (req, res) => {
  let msg = req.body
  sgMail
    .send(msg)
    .then(() => {
      res.json({ type: "success", message: "Email sent" })
    })
    .catch((error) => {
      res.json({ type: "error", message: "Email couldn't sent", error })
    })
})


const PORT = process.env.PORT || 8000
app.get("/", (req, res) => {
  res.send(`Server is running perfectly on port ${PORT}`)
})


app.listen(PORT, () => {
  console.log(`Server is running perfectly on port ${PORT}`)
})