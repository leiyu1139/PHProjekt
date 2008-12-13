<?php
/**
 * User class for PHProjekt 6.0
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 2.1 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * @copyright  Copyright (c) 2008 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL 2.1 (See LICENSE file)
 * @version    $Id:$
 * @author     Nina Schmitt <schmitt@mayflower.de>
 * @package    PHProjekt
 * @subpackage Core
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 */

/**
 * Phprojekt_ACL for PHProjekt 6.0
 *
 * @copyright  Copyright (c) 2008 Mayflower GmbH (http://www.mayflower.de)
 * @version    Release: @package_version@
 * @license    LGPL 2.1 (See LICENSE file)
 * @author     Nina Schmitt <schmitt@mayflower.de>
 * @package    PHProjekt
 * @subpackage Core
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 */
class Phprojekt_Acl extends Zend_Acl
{
    /**
     * Fixed permission values for items and modules
     *
     */
    const NONE      = 0;
    const READ      = 1;
    const WRITE     = 2;
    const ACCESS    = 4;
    const CREATE    = 8;
    const COPY      = 16;
    const DELETE    = 32;
    const DOWNLOAD  = 64;
    const ADMIN     = 128;
    const ALL       = 255;

    /**
     * Singleton instance
     * @var PHProjekt_Acl
     */
    protected static $_instance = null;

    /**
     * Return this class only one time
     *
     * @return PHProjekt_Acl
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructs a Phprojekt ACL
     */
    private function __construct()
    {
        //first construct roles
        $this->_registerRoles();
        //than get rights and assign them to roles and ressources
        $this->_registerRights();
    }

    /**
     * This function adds all Roles to Zend_Acl
     *
     * @return void
     */
    private function _registerRoles()
    {
        $roles = new Phprojekt_Role_Role();
        foreach ($roles->fetchAll() as $role) {
            if ($role->parent < 1) {
                $role->parent = null;
            }
            $this->addRole(new Zend_Acl_Role($role->id), $role->parent);
        }
    }

    /**
     * This function assigns all rights to Zend_Acls
     *
     * @return void
     */
    private function _registerRights()
    {
        $role   = new Phprojekt_Role_RoleModulePermissions();
        $rights = array();
        foreach ($role->fetchAll(null, 'roleId ASC') as $right) {
            $access = Phprojekt_Acl::convertBitmaskToArray($right->access);
            foreach ($access as $name => $value) {
                if ($value) {
                    $rights[$right->roleId][$name][] = $right->moduleId;
                }
            }
        }
        foreach ($rights as $roleId => $accessData) {
            foreach ($accessData as $access => $modules) {
                foreach ($modules as $moduleId) {
                    $resources = array();
                    if (!$this->has($moduleId)) {
                        $this->add(new Zend_Acl_Resource($moduleId));
                    }
                    $resources[] = $moduleId;
                }
                $this->allow($roleId, $modules, $access);
            }
        }
    }

    /**
     * Convert a bitmask into an array with each access
     *
     * @param int $right The number of the bitmask
     *
     * @return array
     */
    static function convertBitmaskToArray($right)
    {
        $return = array();
        $return['none']     = (boolean) ($right == 0) ? true : false;
        $return['read']     = (boolean) ($right & self::READ) ? true : false;
        $return['write']    = (boolean) ($right & self::WRITE) ? true : false;
        $return['access']   = (boolean) ($right & self::ACCESS) ? true : false;
        $return['create']   = (boolean) ($right & self::CREATE) ? true : false;
        $return['copy']     = (boolean) ($right & self::COPY) ? true : false;
        $return['delete']   = (boolean) ($right & self::DELETE) ? true : false;
        $return['download'] = (boolean) ($right & self::DOWNLOAD) ? true : false;
        $return['admin']    = (boolean) ($right & self::ADMIN) ? true : false;
        return $return;
    }

    /**
     * Convert an array with boolean values into a bitmask
     *
     * @param array $rights Array with boolean values for each accees
     *
     * @return int
     */
    static function convertArrayToBitmask($rights)
    {
        $right = self::NONE;
        if ($rights['read']) {
            $right = $right | self::READ;
        }
        if ($rights['write']) {
            $right = $right | self::WRITE;
        }
        if ($rights['access']) {
            $right = $right | self::ACCESS;
        }
        if ($rights['create']) {
            $right = $right | self::CREATE;
        }
        if ($rights['copy']) {
            $right = $right | self::COPY;
        }
        if ($rights['delete']) {
            $right = $right | self::DELETE;
        }
        if ($rights['download']) {
            $right = $right | self::DOWNLOAD;
        }
        if ($rights['admin']) {
            $right = $right | self::ADMIN;
        }
        return $right;
    }
}
