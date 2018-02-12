import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as webpack from 'webpack';
import * as http from 'http';
import * as net from 'net';
import * as os from 'os';
import chalk from 'chalk';
import { exec } from 'child_process';
import { error } from 'util';

const cors = require<any>('cors');
const serveStatic = require<any>('serve-static');
const compression = require<any>('compression');
const bodyParser = require<any>('body-parser');
const morgan = require<any>('morgan');

const __DEV__ = process.env.NODE_ENV !== 'production';
const joinDirname = (...paths: string[]) => path.join(__dirname, '../', ...paths);

function getValidNet(keys: any) {
  const validKey = keys.find((key: string) => os.networkInterfaces()[key]);
  return validKey && os.networkInterfaces()[validKey];
}

let { dist, publicPath, hostName, port }: {
  dist: string;
  publicPath: string;
  hostName: string;
  port: number;
} = require<any>(joinDirname('./config.json'));
if (!__DEV__) port += 1;
// const entries: {
//   route: string;
//   name: string;
//   title: string;
// }[] = require<any>(joinDirname('./config')).entries;
const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (__DEV__) {
  app.use(morgan('dev'));

  const webpackDevMiddleware = require<any>('webpack-dev-middleware');
  const webpackHotMiddleware = require<any>('webpack-hot-middleware');
  const config = require<any>(joinDirname('./webpack.config'));
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    stats: {
      colors: true,
      assets: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    }
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(cors({
    origin: [`http://${hostName}:${port}`],
    methods: ['Get', 'Post'],
    allowedHeaders: ['Content-type', 'Authorization']
  }));

  const FileStreamRoator = require<any>('file-stream-rotator');
  const logDirectory = joinDirname('log');
  if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
  const stream = FileStreamRoator.getStream({
    date_format: 'YYYYMMDD',
    filename: `${logDirectory}/access-%DATE%.log`,
    frequency: 'daily',
    verbose: false
  });
  app.use(morgan('combined', { stream }));
}
app.use('/', serveStatic(joinDirname(dist)));


app.use('/', (req: express.Request, res: express.Response) => {
  res.sendFile(joinDirname(`./${dist}/index.html`));
});


const httpServer = http.createServer(app);
const hn = __DEV__ ? '0.0.0.0' : hostName;

httpServer.listen(port, hn);

httpServer.on('listening', () => {
  const net = getValidNet(['WLAN', '以太网', 'en0', 'en1']);
  const ipv4 = net && net.find((item: any) => item.family === 'IPv4').address;
  console.log(`${__DEV__ ? 'Dev' : 'Prod'}Server run on ${chalk.yellow.bold(`http://${hostName}:${port}`)}`);
  ipv4 && console.log(`Local area network on ${chalk.yellow.bold(`http://${ipv4}:${port}`)}`);
});

httpServer.on('error', (e: any) => {
  const maxPort = 49152;
  if (e.code === 'EADDRINUSE') {
    port = +e.port + 1;
    if (port < maxPort) {
      console.log(`Port ${e.port} in use, restart server on port ${port}`);
      setTimeout(() => {
        httpServer.close();
        httpServer.listen(port, hn);
      }, 1000);
    } else {
      console.log(e);
    }
  }
});
