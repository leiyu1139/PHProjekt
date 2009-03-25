<?php
/**
 * Manage tabs-module relation
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
 * @version    $Id$
 * @author     Gustavo Solt <solt@mayflower.de>
 * @package    PHProjekt
 * @subpackage Core
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 */

/**
 * The class return the tab on each module Id
 *
 * @copyright  Copyright (c) 2008 Mayflower GmbH (http://www.mayflower.de)
 * @package    PHProjekt
 * @subpackage Core
 * @license    LGPL 2.1 (See LICENSE file)
 * @version    Release: @package_version@
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @author     Gustavo Solt <solt@mayflower.de>
 */
class Phprojekt_Tabs
{
    /**
     * Saves the cache for our tab-module entries, to minimize
     * database lookups
     *
     * @var array
     */
    protected static $_cache = null;

    /**
     * Receives all tabs <-> moduleId combinations from the database.
     *
     * The method returns an array of the following format
     *  array( MODULEID   => array(TABID => TABLABEL),
     *         MODULEID   => array(TABID => TABLABEL));
     *
     * @param integer $moduleId The Module Id
     *
     * @return array
     */
    protected static function _getCachedIds($moduleId)
    {
        if (isset(self::$_cache[$moduleId]) && null !== self::$_cache[$moduleId]) {
            return self::$_cache[$moduleId];
        }

        $db     = Phprojekt::getInstance()->getDb();
        $select = $db->select()
                     ->from(array('t' => 'Tab'))
                     ->joinInner(array('rel' => 'ModuleTabRelation'),
                                 sprintf("%s = %s", $db->quoteIdentifier("t.id"),
                                 $db->quoteIdentifier("rel.tabId")))
                     ->where($db->quoteInto('rel.moduleId = ?', $moduleId));
        $stmt = $db->query($select);
        $rows = $stmt->fetchAll();

        // Set the index 0, is not used but is needed for create other index
        self::$_cache[0] = array();

        self::$_cache[$moduleId] = array();
        foreach ($rows as $row) {
           self::$_cache[$moduleId][] = array('id'    => $row['id'],
                                              'label' => $row['label']);
        }

        return self::$_cache[$moduleId];
    }

    /**
     * Returns the tabs for a given module
     *
     * @param string $moduleId The Module Id
     *
     * @return array
     */
    public static function getTabsByModule($moduleId)
    {
        return self::_getCachedIds($moduleId);
    }

    /**
     * Returns all the tabs
     *
     * @return array
     */
    public static function getTabs()
    {
        $db     = Phprojekt::getInstance()->getDb();
        $select = $db->select()
                     ->from('Tab');
        $stmt = $db->query($select);
        return $stmt->fetchAll();
    }

    /**
     * Save/update the tab only
     *
     * @param string  $label The tab label
     * @param integer $id   The tab Id if exists
     *
     * @return int
     */
    public function saveTab($label, $id = 0)
    {
        $db = Phprojekt::getInstance()->getDb();
        if ($id > 0) {
            $data['label'] = $label;
            $db->update('Tab', $data, 'id = ' . (int) $id);
            return $id;
        } else {
            $data['label'] = $label;
            $db->insert('Tab', $data);
            return $db->lastInsertId();
        }
    }

    /**
     * Save the tab-module relation
     *
     * @param array   $tabIds   Wrray with tab Id
     * @param integer $moduleId The module Id
     *
     * @return void
     */
    public function saveModuleTabRelation($tabIds, $moduleId)
    {
        $db = Phprojekt::getInstance()->getDb();
        $db->delete('ModuleTabRelation', $db->quoteInto('moduleId = ?', $moduleId));
        if (!is_array($tabIds)) {
            $tabIds = array($tabIds);
        }
        foreach ($tabIds as $tabId) {
            $data['tabId']    = (int) $tabId;
            $data['moduleId'] = (int) $moduleId;
            $db->insert('ModuleTabRelation', $data);
        }
    }
}