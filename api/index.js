const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express();
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json({extended: true}))

app.get('/', function(req, res) {
  res.send('Hello Worlds!');
});

app.use('/api/repos', require('./routes/repos'))
// app.use('/api/users', require('./routes/users'))
// app.use('/api/auth',require('./routes/auth'))



app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
