import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
let app: admin.app.App = null;

@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  app: admin.app.App = null;
  constructor(private readonly configService: ConfigService) {}
  async onApplicationBootstrap() {
    if (!app) {
      const serviceAccountFile = await readFile(
        this.configService.getOrThrow('FIREBASE_CONFIG'),
        'utf8',
      );
      const serviceAccount = await JSON.parse(serviceAccountFile);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  setup() {
    return app;
  }
}
