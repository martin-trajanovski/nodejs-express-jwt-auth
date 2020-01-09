import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './routes/authentication/authentication.controller';
import UsersController from './routes/users/users.controller';

validateEnv();

const app = new App([new AuthenticationController(), new UsersController()]);

app.listen();
