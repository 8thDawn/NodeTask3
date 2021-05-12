//Create express app
const express = require('express')
const app = express()
const port = 5000

//mongo client
//mongo connection string
const mongoose = require('mongoose')
const connectionString = "mongodb://localhost:27017/profilesapp"

app.use(express.json())

mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Database connected')
    }
} )

//Profile Schema
const profileSchema = new mongoose.Schema({
    title: String,
    name: String,
    email: String,
    country: String
})

const Profile = mongoose.model("Profile", profileSchema)

//POST request to /profiles to create a new profile
app.post("/profilesapp", (req, res) => {
    //create a new profile and save to db
    // retrieve new profile details from req.body
    const profile = req.body.profile
    Profile.create({
        title: profile.title,
        name: profile.name,
        email: profile.email,
        country: profile.country
    }, (err, newProfile) => {
        if(err) {
            return res.status(500).json({ message: err})
        } else {
            return res.status(200).json({ message: "New profile added", newProfile})
        }
    })
})

//GET request to /profiles to fetch all profiles
app.get('/profilesapp', (req, res) => {
    //fetch all profiles
    Profile.find({}, (err, profiles) => {
        if (err) {
            return res.status(500).json({ message: err})
        } else {
            return res.status(200).json({profiles})
        }
    })
    //send response to client
})

//GET request to /profiles/:id to fetch specific profile
app.get('/profilesapp/:id', (req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err})
        } else if (!profile) {
            return res.status(404).json({ message: "Profile not found"})
        } else {
            return res.status(200).json({profile})
        }
    })
})

//PUT request to /profiles/:id to update specific profile
app.put('/profilesapp/:id', (req, res) => {
    Profile.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err})
        } else {
            profile.save((err, saveProfile) => {
                if (err) {
                    return res.status(400).json({ message: err})
                } else {
                    return res.status(200).json({ message: "Profile updated successfully"})
                }
            })
        }
    })
})

//DELETE request to /profiles/:id to delete a profile
app.delete('/profilesapp/:id', (req, res) => {
    Profile.findByIdAndDelete(req.params.id, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err})
        } else if (!profile) {
            return res.status(404).json({ message: "Profile not found"})
        } else {
            return res.status(200).json({ message: "Profile deleted"})
        }
    })
})


app.listen(port, () => console.log(`Server is listening on port ${port}`))

