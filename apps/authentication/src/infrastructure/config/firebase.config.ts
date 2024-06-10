import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
let app: admin.app.App = null;

@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  app: admin.app.App = null;
  constructor() {}
  async onApplicationBootstrap() {
    if (!app) {
      app = admin.initializeApp({
        credential: applicationDefault(),
      });
    }
  }
  setup() {
    return app;
  }
}
