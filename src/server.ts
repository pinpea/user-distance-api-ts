import app from './app';

const port = parseInt( process.env.PORT || '3100' );

const server = new app().Start( port )
  .then( port => console.log( `API demo running on port ${ port }` ) )
  .catch( error => {
    console.log( error );
    process.exit( 1 );
  } );

export default server;