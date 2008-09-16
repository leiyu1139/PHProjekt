<?php
/**
 * User Module Controller for PHProjekt 6.0
 *
 * LICENSE: Licensed under the terms of the PHProjekt 6 License
 *
 * @copyright  2007 Mayflower GmbH (http://www.mayflower.de)
 * @license    http://phprojekt.com/license PHProjekt 6 License
 * @version    CVS: $Id:
 * @author     Gustavo Solt <solt@mayflower.de>
 * @package    PHProjekt
 * @link       http://www.phprojekt.com
 * @since      File available since Release 1.0
 */

/**
 * User Module Controller for PHProjekt 6.0
 *
 * @copyright  2007 Mayflower GmbH (http://www.mayflower.de)
 * @version    Release: @package_version@
 * @license    http://phprojekt.com/license PHProjekt 6 License
 * @package    PHProjekt
 * @link       http://www.phprojekt.com
 * @since      File available since Release 1.0
 * @author     Gustavo Solt <solt@mayflower.de>
 */
class Core_UserController extends Core_IndexController
{
    /**
     * Return a list of all the users except the current user
     *
     * @return void
     */
    public function jsonGetUsersAction()
    {
        $db      = Zend_Registry::get('db');
        $where   = array();
        $where   = "status = 'A' AND id != ". (int)Phprojekt_Auth::getUserId();
        $user    = new Phprojekt_User_User($db);
        $records = $user->fetchAll($where);

        echo Phprojekt_Converter_Json::convert($records, Phprojekt_ModelInformation_Default::ORDERING_LIST);
    }

    /**
     * Gets the content of a setting
     *
     * @uses name parameter as setting key
     *
     * @return void
     */
    public function jsonGetSettingAction()
    {
        $value       = '';
        $settingName = (string) $this->getRequest()->getParam('name', null);

        if (!empty($settingName)) {
            $setting = new Phprojekt_User_UserSetting();
            $value   = $setting->getSetting($settingName);
        }
        echo Phprojekt_Converter_Json::convert($value);
    }

    /**
     * Sets the value for a setting
     *
     * @uses name and value parameters
     *
     * @return void
     *
     */
    public function jsonSetSettingAction()
    {
        $message      = '';
        $settingName  = (string) $this->getRequest()->getParam('name', null);
        $settingValue = (string) $this->getRequest()->getParam('value', null);

        if (!empty($settingName)) {
            $setting = new Phprojekt_User_UserSetting();
            if ($setting->setSetting($settingName, $settingValue)) {
                $return = 'Value saved successful';
            } else {
                $return = 'Value not saved. Error at saving.';
            }
        } else {
            $return = 'A key value needs to be provided';
        }
        echo Phprojekt_Converter_Json::convert($return);
    }

    /**
     * Save settings fields from grid, using the multple save action request
     *
     * @requestparam string data Array with fields and values
     *
     * @return void
     */
    public function jsonSaveMultipleSettingAction()
    {
        $translate = Zend_Registry::get('translate');
        $data      = (array) $this->getRequest()->getParam('data');

        $message = $translate->translate(self::EDIT_MULTIPLE_TRUE_TEXT);
        $showId = array();
        foreach ($data as $id => $fields) {
            if (array_key_exists('value', $fields)) {
                $setting     = new Phprojekt_User_UserSetting();
                $settingName = $setting->getSettingNameById($id);
                $setting->setSetting($settingName, $fields['value']);
                $showId[] = $id;
            }
        }

        $return = array('type'    => 'success',
                        'message' => $message,
                        'code'    => 0,
                        'id'      => implode(',', $showId));

        echo Phprojekt_Converter_Json::convert($return);
    }

    /**
     * Gets the list of all settings and it is returned as an array
     *
     * @return void
     *
     */
    public function jsonGetSettingListAction()
    {
        $settings = new Phprojekt_User_UserSetting();
        $metadata = $settings->getFieldDefinition();
        $records  = $settings->getList();
        
        $data = array();
        $data['id'] = -1;
        $data['keyValue'] = "Password";
        $data['value'] = "";
        $records[] = $data;
        
        $numRows  = array('numRows' => count($records));
        $data     = array("metadata"=> $metadata,
                          "data"    => $records,
                          "numRows" => count($records));
        echo Phprojekt_Converter_Json::convert($data);
    }

    /**
     * Deletes the indicated setting
     *
     * @uses name parameter
     *
     * @return boolean
     */
    public function jsonDeleteSettingAction()
    {
        $message     = '';
        $settingName = (string) $this->getRequest()->getParam('name', null);
        if (!empty($settingName)) {
            $setting = new Phprojekt_User_UserSetting();
            if ($setting->deleteSetting($settingName)) {
                $return = 'Value deleted successful';
            } else {
                $return = 'Value not found.';
            }
        } else {
            $return = 'A key value needs to be provided';
        }
        echo Phprojekt_Converter_Json::convert($return);
    }
}