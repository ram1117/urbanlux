import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
let app: admin.app.App = null;

@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  app: admin.app.App = null;
  constructor(private readonly configService: ConfigService) {}
  async onApplicationBootstrap() {
    if (!app) {
      const firebaseconfig = JSON.parse(
        this.configService.getOrThrow('FIREBASE_CONFIG'),
      );
      app = admin.initializeApp({
        credential: admin.credential.cert(firebaseconfig),
      });
    }
  }
  setup() {
    return app;
  }
}
