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
import colors from 'picocolors';
import prompts from 'prompts';
import semver from 'semver';

import { getPackageInfo, getVersionChoices, run, updateVersion } from './release.utils.ts';
export const release = async () => {
  let targetVersion: string | undefined;
  const { pkg, pkgPath } = getPackageInfo();
  const choices = await getVersionChoices(pkg);
  const { release }: { release: string } = await prompts({
    choices,
    message: '版本号',
    name: 'release',
    type: 'select',
  });

  if (release === 'custom') {
    const res: { version: string } = await prompts({
      initial: pkg.version,
      message: '请输入自定义版本号',
      name: 'version',
      type: 'text',
    });
    targetVersion = res.version;
  } else {
    targetVersion = release;
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }
  console.log(colors.cyan('\nUpdating package version...'));
  updateVersion(pkgPath, targetVersion);
  run('pnpm', ['publish', '--access', 'public', '--no-git-checks']);
  console.log();
};
release();
