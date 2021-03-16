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

namespace Api\Factory;

use Alias\AliasManager;
use Alias\AliasManagerInterface;
use Api\ApiManager;
use Api\Controller\ApiController;
use Api\Service\AuthorizationService;
use Common\Factory\AbstractControllerFactory;
use Instance\Manager\InstanceManager;
use Instance\Manager\InstanceManagerInterface;
use License\Manager\LicenseManager;
use License\Manager\LicenseManagerInterface;
use Notification\SubscriptionManager;
use Notification\SubscriptionManagerInterface;
use User\Manager\UserManager;
use User\Manager\UserManagerInterface;
use Uuid\Manager\UuidManager;
use Uuid\Manager\UuidManagerInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class ApiControllerFactory extends AbstractControllerFactory
{
    protected function createController(ServiceLocatorInterface $serviceManager)
    {
        /** @var AuthorizationService $authorizationService */
        $authorizationService = $serviceManager->get(
            AuthorizationService::class
        );
        $controller = new ApiController($authorizationService);

        /** @var AliasManagerInterface $aliasManager */
        $aliasManager = $serviceManager->get(AliasManager::class);
        $controller->setAliasManager($aliasManager);

        /** @var ApiManager $apiManager */
        $apiManager = $serviceManager->get(ApiManager::class);
        $controller->setApiManager($apiManager);

        /** @var LicenseManagerInterface $licenseManager */
        $licenseManager = $serviceManager->get(LicenseManager::class);
        $controller->setLicenseManager($licenseManager);

        /** @var InstanceManagerInterface $instanceManager */
        $instanceManager = $serviceManager->get(InstanceManager::class);
        $controller->setInstanceManager($instanceManager);

        /** @var SubscriptionManagerInterface $subscriptionManager */
        $subscriptionManager = $serviceManager->get(SubscriptionManager::class);
        $controller->setSubscriptionManager($subscriptionManager);

        /** @var UuidManagerInterface $uuidManager */
        $uuidManager = $serviceManager->get(UuidManager::class);
        $controller->setUuidManager($uuidManager);

        /** @var UserManagerInterface $userManager */
        $userManager = $serviceManager->get(UserManager::class);
        $controller->setUserManager($userManager);

        return $controller;
    }
}
