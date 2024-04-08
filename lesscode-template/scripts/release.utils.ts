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
import { type Options as ExecaOptions, type ExecaReturnValue, execa } from 'execa';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import semver, { type ReleaseType } from 'semver';
interface VersionChoice {
  title: string;
  value: string;
}
interface PackageJSON {
  name: string;
  private?: boolean;
  version?: string;
}

export async function run(bin: string, args: string[], opts: ExecaOptions = {}): Promise<ExecaReturnValue> {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}
export function getPackageInfo<T extends PackageJSON>(relativePth = '../package.json') {
  const pkgPath = resolve(__dirname, relativePth);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as T;
  if (pkg.private) {
    throw new Error(`Package ${pkg.name} is private`);
  }

  return { pkg, pkgPath };
}
export async function getVersionChoices(pkg: PackageJSON): Promise<VersionChoice[]> {
  const currentBeta = pkg.version?.includes('beta');
  const currentAlpha = pkg.version?.includes('alpha');
  const isStable = !currentBeta && !currentAlpha;

  function inc(i: ReleaseType, tag = currentAlpha ? 'alpha' : 'beta') {
    return semver.inc(pkg.version!, i, tag)!;
  }

  let versionChoices: VersionChoice[] = [
    {
      title: 'next',
      value: inc(isStable ? 'patch' : 'prerelease'),
    },
  ];

  if (isStable) {
    versionChoices.push(
      {
        title: 'beta-minor',
        value: inc('preminor'),
      },
      {
        title: 'beta-major',
        value: inc('premajor'),
      },
      {
        title: 'alpha-minor',
        value: inc('preminor', 'alpha'),
      },
      {
        title: 'alpha-major',
        value: inc('premajor', 'alpha'),
      },
      {
        title: 'minor',
        value: inc('minor'),
      },
      {
        title: 'major',
        value: inc('major'),
      },
    );
  } else if (currentAlpha) {
    versionChoices.push({
      title: 'beta',
      value: inc('patch') + '-beta.0',
    });
  } else {
    versionChoices.push({
      title: 'stable',
      value: inc('patch'),
    });
  }
  versionChoices.push({ title: 'custom', value: 'custom' });

  versionChoices = versionChoices.map(i => {
    i.title = `${i.title} (${i.value})`;
    return i;
  });

  return versionChoices;
}
export function updateVersion(pkgPath: string, version: string): void {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}
export async function getActiveVersion(npmName: string): Promise<string | undefined> {
  try {
    return (await run('npm', ['info', npmName, 'version'], { stdio: 'pipe' })).stdout;
  } catch (e: any) {
    // Not published yet
    if (e.stderr.startsWith('npm ERR! code E404')) return;
    throw e;
  }
}
