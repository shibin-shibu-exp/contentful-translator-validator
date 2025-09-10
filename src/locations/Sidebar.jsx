import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Box,
  Button,
  Flex,
  Spinner,
  Select,
  Text,
  CopyButton,
  Caption,
  Note,
  FormControl,
  FormLabel,
} from '@contentful/f36-components';
import { Multiselect } from '@contentful/f36-multiselect';
import { useSDK } from '@contentful/react-apps-toolkit';
import translateWithGemini from '../utils/translateWithGemini';

const Sidebar = () => {
  const sdk = useSDK();
  const { entry, contentType } = sdk;

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);


  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [translations, setTranslations] = useState({});
  const [targetLang, setTargetLang] = useState('United States - English');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!contentType || !contentType.fields) {
      return; 
    }
    const textFields = contentType.fields
      .filter(field => ['Symbol', 'Text'].includes(field.type))
      .map(field => ({
        value: field.id,   
        label: field.name, 
      }));
      
    console.log("Filtered text fields:", textFields);
    setAvailableFields(textFields);
    console.log("Set text fields:", availableFields);
    
  }, [contentType]);

  const handleFieldSelection = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFields((prevState) => [...prevState, value]);
    } else {
      setSelectedFields((prevState) => prevState.filter((fieldId) => fieldId !== value));
    }
  };

  const hasTranslations = Object.keys(translations).length > 0;

  const handleGenerateTranslations = async () => {
    if (selectedFields.length === 0) {
      sdk.notifier.warning("Please select at least one field to translate.");
      return;
    }

    setIsTranslating(true);
    setTranslations({});

    const fieldsToTranslate = {};
    for (const fieldId of selectedFields) {
      const value = entry.fields[fieldId].getValue();
      if (typeof value === 'string' && value.trim()) {
        fieldsToTranslate[fieldId] = value;
      }
    }

    if (Object.keys(fieldsToTranslate).length === 0) {
      sdk.notifier.warning("The selected fields are empty. Please add some text.");
      setIsTranslating(false);
      return;
    }

    try {
      const result = await translateWithGemini(fieldsToTranslate, targetLang);
      setTranslations(result);
    } catch (error) {
      console.error("Translation failed:", error);
      sdk.notifier.error("Failed to generate translations. See console for details.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Box>
      <Flex flexDirection="column" gap="0">
        <FormControl id="language-select">
          <FormLabel>Target Language</FormLabel>
          <Select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="Andorra - Español">Andorra - Español</option>
            <option value="Argentina - Español">Argentina - Español</option>
            <option value="Australia - English">Australia - English</option>
            <option value="Belgique - Français">Belgique - Français</option>
            <option value="Belgium - Nederlands">Belgium - Nederlands</option>
            <option value="Brasil - Português">Brasil - Português</option>
            <option value="Canada - English">Canada - English</option>
            <option value="Canada - Français">Canada - Français</option>
            <option value="Česká Republika - Česky">Česká Republika - Česky</option>
            <option value="Chile - Español">Chile - Español</option>
            <option value="中国 - 中文">中国 - 中文</option>
            <option value="Colombia - Español">Colombia - Español</option>
            <option value="Danmark - Dansk">Danmark - Dansk</option>
            <option value="Deutschland - Deutsch">Deutschland - Deutsch</option>
            <option value="España - Español">España - Español</option>
            <option value="European Markets - English">European Markets - English</option>
            <option value="France - Français">France - Français</option>
            <option value="Hong Kong China - English">Hong Kong China - English</option>
            <option value="India - English">India - English</option>
            <option value="Indonesia - Bahasa Indonesia">Indonesia - Bahasa Indonesia</option>
            <option value="Ireland - English">Ireland - English</option>
            <option value="Italia - Italiano">Italia - Italiano</option>
            <option value="Japan - Japanese">Japan - Japanese</option>
            <option value="Jordan - English">Jordan - English</option>
            <option value="Korea - 한국어">Korea - 한국어</option>
            <option value="العربية - دولة الكويت">العربية - دولة الكويت</option>
            <option value="Kuwait - English">Kuwait - English</option>
            <option value="Luxembourg - Français">Luxembourg - Français</option>
            <option value="Macau, China - English">Macau, China - English</option>
            <option value="Magyarország - Magyar">Magyarország - Magyar</option>
            <option value="Malaysia - English">Malaysia - English</option>
            <option value="México - Español">México - Español</option>
            <option value="Middle East - العربية">Middle East - العربية</option>
            <option value="Middle East - English">Middle East - English</option>
            <option value="Myanmar - English">Myanmar - English</option>
            <option value="Nederland - Nederlands">Nederland - Nederlands</option>
            <option value="New Zealand - English">New Zealand - English</option>
            <option value="Norge - Norsk">Norge - Norsk</option>
            <option value="Österreich - Deutsch">Österreich - Deutsch</option>
            <option value="Philippines - English">Philippines - English</option>
            <option value="Polska - Polski">Polska - Polski</option>
            <option value="Portugal - Português">Portugal - Português</option>
            <option value="Qatar - English">Qatar - English</option>
            <option value="România - Română">România - Română</option>
            <option value="العربية - المملكة العربية السعودية">العربية - المملكة العربية السعودية</option>
            <option value="Saudi Arabia - English">Saudi Arabia - English</option>
            <option value="Schweiz - Deutsch">Schweiz - Deutsch</option>
            <option value="Singapore - English">Singapore - English</option>
            <option value="Slovensko - Slovenský">Slovensko - Slovenský</option>
            <option value="South Africa - English">South Africa - English</option>
            <option value="Suisse - Français">Suisse - Français</option>
            <option value="Suomi - Suomeksi">Suomi - Suomeksi</option>
            <option value="Sverige - Svensk">Sverige - Svensk</option>
            <option value="Svizzera - Italiano">Svizzera - Italiano</option>
            <option value="Taiwan - China">Taiwan - China</option>
            <option value="Thailand - Thai">Thailand - Thai</option>
            <option value="Türkiye - Türk">Türkiye - Türk</option>
            <option value="العربية - الامارات العربية المتحدة">العربية - الامارات العربية المتحدة</option>
            <option value="United Arab Emirates - English">United Arab Emirates - English</option>
            <option value="United Kingdom - English">United Kingdom - English</option>
            <option value="United States - English">United States - English</option>
            <option value="Vietnam - Vietnamese">Vietnam - Vietnamese</option>
          </Select>
        </FormControl>

        <FormControl id="field-select">
          <FormLabel>Fields to Translate</FormLabel>
          <Multiselect
            searchProps={{
              searchPlaceholder: availableFields.length > 0 ? "Select fields..." : "Loading fields...",
            }}
            isDisabled={availableFields.length === 0}
            currentSelection={selectedFields}
            currentSelectionLabel={`${selectedFields.length} fields selected`}
          >
            {availableFields.map((field) => (
              <Multiselect.Option
                key={field.value}
                value={field.value}
                label={field.label}
                onSelectItem={handleFieldSelection}
                isChecked={selectedFields.includes(field.value)}
              />
            ))}
          </Multiselect>
        </FormControl>

        {hasTranslations && (
            <Accordion style={{ marginBottom: '15px' }}>
              <Accordion.Item title={
                <Caption fontWeight="fontWeightMedium" fontColor='gray900' fontSize='fontSizeS'>
                  {`Generated Translations (${Object.keys(translations).length})`}
                </Caption>
              }>
                <Flex flexDirection="column">
                  {Object.entries(translations).map(([fieldId, translatedText]) => (
                    <Box key={fieldId}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <pre fontColor="gray700"><strong>{fieldId}</strong></pre>
                        <CopyButton value={translatedText} size='small'/>
                      </Flex>
                      <Caption
                        style={{ textAlign: 'right' }}
                        fontColor="gray600" 
                      >
                        Characters: {translatedText.length}
                      </Caption>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px'}}>
                        {translatedText}
                      </pre>
                    </Box>
                  ))}
                </Flex>
              </Accordion.Item>
            </Accordion>
        )}

        <Button 
          onClick={handleGenerateTranslations} 
          isDisabled={isTranslating || selectedFields.length === 0} 
          variant="primary" 
          isFullWidth
          endIcon={isTranslating ? <Spinner variant="white" /> : null}
        >
          {isTranslating ? 'Translating...' : 'Generate Translations'}
        </Button>
      </Flex>
    </Box>
  );
};

export default Sidebar;