
// Obtener eventos
// Todas tienen que pasar por la validacion del JWT
const { Router } = require('express')
const { getEvents, createEvents, updateEvent, deleteEvent } = require("../controllers/events");
const { jwtValidator } = require("../middlewares/jwtValidator");
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { isDate } = require('../helpers/isDate');

const router = Router()

router.use(jwtValidator)


router.get('/', getEvents)

// Crear un nuevo evento

router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    fieldValidator
], createEvents)

// Actualizar Evento

router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    fieldValidator
], updateEvent)

// Eliminar Evento

router.delete('/:id', deleteEvent)

module.exports = router


