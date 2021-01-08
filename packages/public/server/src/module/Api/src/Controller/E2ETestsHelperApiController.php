<?php

namespace Api\Controller;

use Api\Manager\E2ETestsHelperApiManager;
use Api\Manager\NotificationApiManager;
use Event\Entity\EventLogInterface;
use Zend\Cache\Storage\StorageInterface;
use Zend\Http\Response;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class E2ETestsHelperApiController extends AbstractActionController
{
    /** @var NotificationApiManager */
    protected $notificationApiManager;
    /** @var E2ETestsHelperApiManager */
    protected $e2eManager;
    /** @var  StorageInterface */
    protected $storage;
    /** @var bool */
    protected $isActive;
    protected $lastEventIdKey = 'last-event-id';

    public function __construct(
        bool $isActive,
        NotificationApiManager $notificationApiManager,
        E2ETestsHelperApiManager $e2eManager,
        StorageInterface $storage
    ) {
        $this->isActive = $isActive;
        $this->notificationApiManager = $notificationApiManager;
        $this->e2eManager = $e2eManager;
        $this->storage = $storage;

        if (
            $this->isActive &&
            !$this->storage->hasItem($this->lastEventIdKey)
        ) {
            $this->setUp();
        }
    }

    protected function setUp()
    {
        $this->storage->setItem(
            $this->lastEventIdKey,
            $this->e2eManager->getLastEvent()->getId()
        );
    }

    public function setUpAction()
    {
        if ($this->isActive) {
            $this->setUp();

            $this->getResponse()->setStatusCode(Response::STATUS_CODE_200);
            return $this->getResponse();
        } else {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_404);
            return $this->getResponse();
        }
    }

    public function eventsSinceSetUpAction()
    {
        if (
            !$this->isActive ||
            !$this->storage->hasItem($this->lastEventIdKey)
        ) {
            $this->getResponse()->setStatusCode(Response::STATUS_CODE_404);
            return $this->getResponse();
        }

        $lastEventId = $this->storage->getItem($this->lastEventIdKey);
        $events = $this->e2eManager->getEventsAfter($lastEventId);

        return new JsonModel([
            'events' => array_map(function (EventLogInterface $event) {
                return $this->notificationApiManager->getEventDataById(
                    $event->getId()
                );
            }, $events),
        ]);
    }
}