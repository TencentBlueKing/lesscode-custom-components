/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { CommonServerOptions, ProxyOptions, defineConfig } from 'vite';

import { createCommonConfig } from './vite.utils';
const devProxyUrl = ''; // 需要代理的api环境链接 不填默认 localhost
const host = devProxyUrl.length ? `appdev.${devProxyUrl.match(/\.([^.]+)\.com\/?/)?.[1]}.com` : 'localhost'; // 本地host配置的域名host
const port = 8001;
const context = [
  '/apm',
  '/rest',
  '/fta',
  '/api',
  '/weixin',
  '/version_log',
  '/calendars',
  '/alert',
  '/query-api',
] as const;
const createProxyConfig = (context: readonly string[], target: string): CommonServerOptions['proxy'] => {
  return context.reduce(
    (proxyConfig, api) => ({
      ...proxyConfig,
      [api]: {
        changeOrigin: true,
        secure: false,
        target,
        toProxy: true,
      },
    }),
    {} as Record<(typeof context)[number], ProxyOptions>,
  );
};
export default defineConfig(() => ({
  ...createCommonConfig(),
  server: {
    headers: {
      Cookie: '',
      'X-CSRFToken': '',
      host: devProxyUrl.replace(/https?:\/\//i, ''),
      referer: devProxyUrl,
      xsrfCookieName: 'X-CSRFToken', // 固定配置值
    },
    host,
    port,
    proxy: createProxyConfig(context, devProxyUrl),
  },
}));
