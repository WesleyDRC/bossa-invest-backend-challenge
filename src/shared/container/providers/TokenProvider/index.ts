import { container } from 'tsyringe';

import { JwtProvider } from './implementations/JwtProvider';
import { ITokenProvider } from './models/ITokenProvider';

container.registerSingleton<ITokenProvider>('TokenProvider', JwtProvider);
