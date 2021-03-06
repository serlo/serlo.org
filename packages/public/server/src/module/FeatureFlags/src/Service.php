<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace FeatureFlags;

class Service
{
    /**
     * @var array
     */
    private $flags;
    /**
     * @var ServiceLoggerInterface
     */
    private $sentry;

    /**
     * Service constructor.
     * @param array $config
     * @param ServiceLoggerInterface $sentry
     */
    // We intentionally don't provide a type for `$sentry` here since we can't cast `\Raven_Client` to `ServiceLoggerInterface`
    public function __construct(array $config, $sentry)
    {
        $this->flags = $config;
        $this->sentry = $sentry;
    }

    /**
     * @param string $feature
     * @return bool
     */
    public function isEnabled(string $feature): bool
    {
        if (!array_key_exists($feature, $this->flags)) {
            $this->sentry->captureMessage(
                'No configuration found for feature flag "%s"',
                [$feature]
            );
            return false;
        }

        return $this->flags[$feature];
    }
}
