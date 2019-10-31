const express = require('express');
const Joi = require('joi')

const app = express();

app.use(express.json());

const courses = [
    {
        id: 1,
        name: "Course 1"
    },
    {
        id: 2,
        name: "Course 2"
    },
    {
        id: 3,
        name: "Course 3"
    }
]

app.get('/', (req,res) =>{
    res.send("Hello World");
});

app.get('/api/courses', (req,res) =>{
    res.send(courses);
});

app.post('/api/courses', (req,res) =>{

    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        
    const course = {
        id: courses.length +1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req,res) =>{
    //To check whether course with ID is present or not
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found');

    //To validate the request
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //To update the course
    course.name = req.body.name;
    res.send(course);

});




app.get('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found');

    res.send(course);
});

app.delete('/api/courses/:id', (req,res) =>{
    // Look whether the course is present or not
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}



const port = process.env.PORT || 3000; 
app.listen(port, () =>{
    console.log(`Listening on Port ${port}..!`);
});