const { response } = require("express");
const Event = require('../models/Event')


const getEvents = async(req, res = response) => {

    const events = await Event.find().populate('user', 'name')

    res.json({
        ok: true,
        events
    })
}

const createEvents = async(req, res = response) => {

    const event = new Event( req.body )

    try {
        
        event.user = req.uid

        const eventDB = await event.save()
        return res.json({
            ok: true,
            event: eventDB
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const updateEvent = async(req, res = response) => {
    
    const { id } = req.params
    const uid = req.uid

    try {

        const event = await Event.findById(id)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( id, newEvent, { new: true } )

        return res.json({
            ok: true,
            event: eventUpdated
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const deleteEvent = async(req, res = response) => {
    const { id } = req.params
    const uid = req.uid

    try {
        const event = await Event.findById(id)

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        await Event.findByIdAndDelete( id )

        return res.json({
            ok: true
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEvents,
    createEvents,
    updateEvent,
    deleteEvent
}