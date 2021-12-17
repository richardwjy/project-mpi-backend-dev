const express = require('express')
const router = express.Router();
const members = require('../../Members')

// Get all members
router.get('/', (req, res) => {
    res.json(members);
})

// Get specific members
router.get('/:id?', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `Member with id: ${req.params.id} is not found!` })
    }
})

// Create Member
router.post('/', (req, res) => {
    const newMember = {
        id: 10,
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }
    if (!newMember.name || !newMember.email) {
        res.status(400).json({ errMsg: "Please include a name and email" })
    } else {
        members.push(newMember)
        res.json(members)
    }
})

// Update Member
router.put('/:id?', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        const updMember = req.body;
        members.forEach(member => {
            if (member.id === parseInt(req.params.id)) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : member.email;
                res.json({ msg: 'Member updated', member })
            }
        })

    } else {
        res.status(400).json({ msg: `Member with id: ${req.params.id} is not found!` })
    }
})

// Delete Member
router.delete('/:id?', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
        res.json({ msg: 'Member deleted', members: members.filter(member => member.id !== parseInt(req.params.id)) });
    } else {
        res.status(400).json({ msg: `Member with id: ${req.params.id} is not found!` })
    }
})

module.exports = router