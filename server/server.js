const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Plane, Flight, Booking } = require('./models');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.post('/api/plane', async (req, res) => {
    try {
        const { name, value } = req.body;
        Plane.create({
            name: name || 'неизвестен',
            value: value || 1,
        });  
        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Saving plane error' });
    }
});

app.get('/api/plane', async (req, res) => {
    try {
        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Getting plane error' });
    }
});

app.delete('/api/plane/:planeId', async (req, res) => {
    try {
        const planeId = req.params.planeId;
        const planeToDelete = await Plane.findByPk(planeId);
        if (!planeToDelete) {
            return res.status(404).json({ error: 'Plane is not found' });
        }
        await planeToDelete.destroy();
        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Plane could not be deleted' });
    }
});

app.get('/api/flight', async (req, res) => {
    try {
        const flights = await Flight.findAll({
            include: [{
                model: Booking,
                as: 'bookings',
            }],
        });
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Getting flight error' });
    }
});

app.post('/api/flight', async (req, res) => {
    try {
        const { name, date, target, planeId } = req.body;
        const plane = await Plane.findByPk(planeId);
        if (!plane) {
            return res.status(404).json({ error: 'Chosen plane is not found' });
        }
        const existingFlight = await Flight.findOne({
            where: {
                date: date,
                target: target,
            },
        });
        if (existingFlight) {
            return res.status(400).json({ error: 'There is no flight with such date or arrival point' });
        }
        Flight.create({
            name: name,
            date: date,
            target: target,
            planeId: planeId,
        });
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Flight creating error' });
    }
});

app.put('/api/flight/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const { name, date, target, planeId } = req.body;
        const plane = await Plane.findByPk(planeId);
        if (!plane) {
            return res.status(404).json({ error: 'Chosen plane is not found' });
        }
        const existingFlight = await Flight.findOne({
            where: {
                date: date,
                target: target,
            },
        });
        if (existingFlight) {
            return res.status(400).json({ error: 'Flight with such date and arrival point already exists' });
        }
        const flight = await Flight.findByPk(flightId);
        await flight.update({
            name: name || flight.name,
            date: date || flight.date,
            target: target || flight.target,
            planeId: planeId || flight.planeId,
        });
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Flight editing error' });
    }
});
app.delete('/api/flight/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const flightToDelete = await Flight.findByPk(flightId);
        if (!flightToDelete) {
            return res.status(404).json({ error: 'Flight is not found' });
        }
        await flightToDelete.destroy();
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Flight deleting error' });
    }
});

app.post('/api/booking/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const { name } = req.body;
        if (!name) {
            return res.status(404).json({ error: 'You have to enter you first and last names first' });
        }
        const flight = await Flight.findByPk(flightId);
        if (!flight) {
            return res.status(404).json({ error: 'Flight is not found' });
        }
        const bookedSeats = await Booking.count({
            where: {
                flightId: flightId,
            },
        });
        const plane = await Plane.findByPk(flight.planeId);
        if (!plane) {
            return res.status(404).json({ error: 'Plane is not found' });
        }
        if (bookedSeats >= plane.value) {
            return res.status(400).json({ error: 'No free places on this flight' });
        }
        const existingBooking = await Booking.findOne({
            where: {
                name: name,
            },
        });
        if (existingBooking) {
            return res.status(400).json({ error: 'There is already a booking with such first and last names' });
        }
        Booking.create({
            name: name,
            flightId: flightId,
        });
        const bookings = await Booking.findAll({
            where: {
                flightId: flightId,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Saving error' });
    }
});

app.put('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { name, flightId } = req.body;
        const flight = await Flight.findByPk(flightId);
        if (!flight) {
            return res.status(404).json({ error: 'Flight is not found' });
        }
        const existingBooking = await Booking.findOne({
            where: {
                name: name,
                id: { [Op.ne]: bookingId },
            },
        });
        if (existingBooking) {
            return res.status(400).json({ error: 'There is already a booking with such first and last names' });
        }
        const plane = await Plane.findByPk(flight.planeId);
        const bookedSeats = await Booking.count({
            where: {
                flightId: flightId,
            },
        });
        if (bookedSeats >= plane.value) {
            return res.status(400).json({ error: 'No free places on this flight' });
        }
        const booking = await Booking.findByPk(bookingId);
        if (flightId != booking.flightId) {
            const bookedSeats = await Booking.count({
                where: {
                    flightId: flightId,
                },
            });
            if (bookedSeats >= flight.value) {
                return res.status(400).json({ error: 'No free places on this flight' });
            }
        }
        const oldFlight = await Flight.findByPk(booking.flightId);
        if (oldFlight.target !== flight.target) {
            return res.status(400).json({ error: 'New arrival point should be the same as the old one' });
        }
        await booking.update({
            name: name,
            flightId: flightId,
        });
        res.json({ message: 'Booking succesfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Editing error' });
    }
});

app.get('/api/booking/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const bookings = await Booking.findAll({
            where: {
                flightId: flightId,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Getting error' });
    }
});

app.delete('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const bookingToDelete = await Booking.findByPk(bookingId);
        if (!bookingToDelete) {
            return res.status(404).json({ error: 'Booking is not found' });
        }
        await bookingToDelete.destroy();
        res.json({ message: 'Booking is succesfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Booking deleting error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port=${port}`);
});