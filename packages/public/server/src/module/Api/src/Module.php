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

namespace Api;

use Api\Listener\DiscussionManagerListener;
use Api\Listener\LicenseManagerListener;
use Api\Listener\LinkServiceListener;
use Api\Listener\NotificationManagerListener;
use Api\Listener\PageManagerListener;
use Api\Listener\RepositoryManagerListener;
use Api\Listener\SubscriptionManagerListener;
use Api\Listener\TaxonomyManagerListener;
use Api\Listener\UserManagerListener;
use Api\Listener\UuidManagerListener;
use Zend\EventManager\EventInterface;
use Zend\ModuleManager\Feature\BootstrapListenerInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Mvc\MvcEvent;

class Module implements BootstrapListenerInterface, ConfigProviderInterface
{
    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function onBootstrap(EventInterface $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach(
            MvcEvent::EVENT_DISPATCH,
            [$this, 'onDispatchRegisterListeners'],
            1000
        );
    }

    public function onDispatchRegisterListeners(MvcEvent $e)
    {
        $application = $e->getApplication();
        $serviceManager = $application->getServiceManager();
        $eventManager = $e->getApplication()->getEventManager();
        $sharedEventManager = $eventManager->getSharedManager();
        $sharedEventManager->attachAggregate(
            $serviceManager->get(DiscussionManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(LicenseManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(LinkServiceListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(NotificationManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(PageManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(RepositoryManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(SubscriptionManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(TaxonomyManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(UserManagerListener::class)
        );
        $sharedEventManager->attachAggregate(
            $serviceManager->get(UuidManagerListener::class)
        );
    }
}
