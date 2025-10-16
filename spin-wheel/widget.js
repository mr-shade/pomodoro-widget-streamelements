/*
 * StreamElements Spin Wheel Widget
 * Optimized specifically for StreamElements Dashboard
 * Copy this entire code to the JavaScript tab in StreamElements
 */

// StreamElements Widget Variables
let widget = {
    config: {
        enableSpinCommand: true,
        spinCommand: '!spin',
        cooldown: 10,
        whoCanParticipate: 'everyone',
        enableWinnerPopup: false,
        enableConfetti: true,
        enableManualSpin: true,
        spinSpeed: 'normal',
        minimumSpinCount: 2,
        pointsThreshold: 50,
        trackTips: false,
        trackSubscriptions: false,
        trackResubscriptions: false,
        trackGiftSubs: false,
        trackDirectGifts: false,
        trackCheers: false,
        pointsPerTip: 1,
        pointsPerFollow: 1,
        pointsPerSub: 5,
        pointsPerResub: 5,
        pointsPerGift: 5,
        pointsPerDirectGift: 5,
        pointsPerCheer: 1,
        subMessageFormat: '<username> subscribed',
        resubMessageFormat: '<username> re-subbed'
    },
    wheelOptions: ["Prize 1", "Prize 2", "Prize 3", "Try Again", "Bonus", "Lucky Draw", "More", "Got This"],
    wheelColors: ['#d6bcfd', '#a4a0ec'],
    customColors: {
        borderColor: '#1e14ea',
        innerRingColor: '#9476df',
        outerRingColor: '#342140',
        confettiColor1: '#9476df',
        confettiColor2: '#fcd580',
        iconColor: '#13e5d6',
        highlighterColor: '#13e5d6',
        textColor: '#342140',
        starColor: '#fee3aa'
    },
    centerButton: {
        type: 'star',
        customImage: '',
        imageSize: 70,
        customText: 'SPIN',
        textSize: 16,
        textColor: '#333333'
    },
    fontSettings: {
        wheelTextFont: 'Arial',
        customFontFamily: '',
        wheelTextSize: 14,
        wheelTextWeight: 'normal',
        wheelTextStyle: 'normal',
        wheelTextTransform: 'none',
        wheelTextLetterSpacing: 0,
        enableTextShadow: false,
        textShadowColor: '#000000',
        textShadowBlur: 2,
        textShadowOffsetX: 1,
        textShadowOffsetY: 1,
        enableTextStroke: false,
        textStrokeColor: '#ffffff',
        textStrokeWidth: 1
    },
    isSpinning: false,
    lastSpinTime: 0,
    cooldownTime: 10000,
    currentUser: null,
    winnerText: "",
    degree: 1800,
    clicks: 0,
    initialized: false
};

// Main initialization - StreamElements standard pattern
window.addEventListener('onWidgetLoad', function (obj) {
    console.log('[SE Widget] onWidgetLoad event received:', obj);

    // Extract fieldData using StreamElements standard pattern
    const fieldData = obj.detail.fieldData;
    console.log('[SE Widget] fieldData from onWidgetLoad:', fieldData);

    // Process field data and override defaults
    if (fieldData) {
        processFieldData(fieldData);
    }

    // Initialize widget after DOM is ready
    setTimeout(() => {
        initializeWidget();
    }, 100);
});

// Process field data from StreamElements
function processFieldData(data) {
    console.log('[SE Widget] Processing fieldData:', data);
    console.log('[SE Widget] fieldData type:', typeof data);
    console.log('[SE Widget] fieldData keys:', Object.keys(data));

    try {
        // StreamElements sometimes sends fieldData as numbered array instead of named properties
        // Check if data is in array format (numbered keys) or object format
        const isArrayFormat = typeof data === 'object' && Object.keys(data).every(key => !isNaN(key));

        let fieldValues = {};

        if (isArrayFormat) {
            console.log('[SE Widget] Detected array format fieldData');
            // Map array indices to field names based on fields.json order
            const fieldMapping = [
                'enableSpinCommand',    // 0
                'spinCommand',          // 1
                'whoCanParticipate',    // 2
                'cooldownType',         // 3
                'customCooldown',       // 4
                'wheelOptions',         // 5
                'primaryColor',         // 6
                'secondaryColor',       // 7
                'borderColor',          // 8
                'innerRingColor',       // 9
                'outerRingColor',       // 10
                'confettiColor1',       // 11
                'confettiColor2',       // 12
                'iconColor',            // 13
                'highlighterColor',     // 14
                'textColor',            // 15
                'starColor',            // 16
                'centerImageType',      // 17
                'centerCustomImage',    // 18
                'centerImageSize',      // 19
                'centerCustomText',     // 20
                'centerTextSize',       // 21
                'centerTextColor',      // 22
                'enableWinnerPopup',    // 23
                'enableConfetti',       // 24
                'enableManualSpin',     // 25
                'spinSpeed',            // 26
                'minimumSpinCount',     // 27
                'pointsThreshold',      // 28
                'trackTips',            // 29
                'trackSubscriptions',   // 30
                'trackResubscriptions', // 31
                'trackGiftSubs',        // 32
                'trackDirectGifts',     // 33
                'trackCheers',          // 34
                'pointsPerTip',         // 35
                'pointsPerFollow',      // 36
                'pointsPerSub',         // 37
                'pointsPerResub',       // 38
                'pointsPerGift',        // 39
                'pointsPerDirectGift',  // 40
                'pointsPerCheer',       // 41
                'subMessageFormat',     // 42
                'resubMessageFormat',   // 43
                'wheelTextFont',        // 44
                'customFontFamily',     // 45
                'wheelTextSize',        // 46
                'wheelTextWeight',      // 47
                'wheelTextStyle',       // 48
                'wheelTextTransform',   // 49
                'wheelTextLetterSpacing', // 50
                'enableTextShadow',     // 51
                'textShadowColor',      // 52
                'textShadowBlur',       // 53
                'textShadowOffsetX',    // 54
                'textShadowOffsetY',    // 55
                'enableTextStroke',     // 56
                'textStrokeColor',      // 57
                'textStrokeWidth'       // 58
            ];

            // Convert array format to named properties
            fieldMapping.forEach((fieldName, index) => {
                if (data[index] !== undefined) {
                    fieldValues[fieldName] = data[index];
                }
            });

            console.log('[SE Widget] Converted fieldData to named properties:', fieldValues);
        } else {
            console.log('[SE Widget] Detected object format fieldData');
            fieldValues = data;
        }

        // Apply color changes immediately for both formats
        if (fieldValues.primaryColor) {
            widget.wheelColors[0] = fieldValues.primaryColor;
            console.log('[SE Widget] Applied primaryColor:', fieldValues.primaryColor);
        }
        if (fieldValues.secondaryColor) {
            widget.wheelColors[1] = fieldValues.secondaryColor;
            console.log('[SE Widget] Applied secondaryColor:', fieldValues.secondaryColor);
        }

        // Apply custom colors
        if (fieldValues.borderColor) {
            widget.customColors.borderColor = fieldValues.borderColor;
            console.log('[SE Widget] Applied borderColor:', fieldValues.borderColor);
        }

        if (fieldValues.innerRingColor) {
            widget.customColors.innerRingColor = fieldValues.innerRingColor;
            console.log('[SE Widget] Applied innerRingColor:', fieldValues.innerRingColor);
        }

        if (fieldValues.outerRingColor) {
            widget.customColors.outerRingColor = fieldValues.outerRingColor;
            console.log('[SE Widget] Applied outerRingColor:', fieldValues.outerRingColor);
        }

        if (fieldValues.confettiColor1) {
            widget.customColors.confettiColor1 = fieldValues.confettiColor1;
            console.log('[SE Widget] Applied confettiColor1:', fieldValues.confettiColor1);
        }

        if (fieldValues.confettiColor2) {
            widget.customColors.confettiColor2 = fieldValues.confettiColor2;
            console.log('[SE Widget] Applied confettiColor2:', fieldValues.confettiColor2);
        }

        if (fieldValues.iconColor) {
            widget.customColors.iconColor = fieldValues.iconColor;
            console.log('[SE Widget] Applied iconColor:', fieldValues.iconColor);
        }

        if (fieldValues.highlighterColor) {
            widget.customColors.highlighterColor = fieldValues.highlighterColor;
            console.log('[SE Widget] Applied highlighterColor:', fieldValues.highlighterColor);
        }

        if (fieldValues.textColor) {
            widget.customColors.textColor = fieldValues.textColor;
            console.log('[SE Widget] Applied textColor:', fieldValues.textColor);
        }

        if (fieldValues.starColor) {
            widget.customColors.starColor = fieldValues.starColor;
            console.log('[SE Widget] Applied starColor:', fieldValues.starColor);
        }

        console.log('[SE Widget] Widget config before override:', JSON.parse(JSON.stringify(widget.config)));
        console.log('[SE Widget] Wheel options before override:', [...widget.wheelOptions]);
        console.log('[SE Widget] Wheel colors before override:', [...widget.wheelColors]);

        // Override basic settings with fieldData values
        if (fieldValues.enableSpinCommand !== undefined) {
            widget.config.enableSpinCommand = fieldValues.enableSpinCommand;
            console.log('[SE Widget] Override enableSpinCommand:', fieldValues.enableSpinCommand);
        }

        if (fieldValues.spinCommand !== undefined && fieldValues.spinCommand !== '') {
            widget.config.spinCommand = fieldValues.spinCommand.toLowerCase();
            console.log('[SE Widget] Override spinCommand:', fieldValues.spinCommand);
        }

        if (fieldValues.cooldownType !== undefined && fieldValues.customCooldown !== undefined) {
            if (fieldValues.cooldownType === 'default') {
                widget.config.cooldown = 10;
                widget.cooldownTime = 10000;
                console.log('[SE Widget] Using default cooldown: 10 seconds');
            } else if (fieldValues.cooldownType === 'custom' && fieldValues.customCooldown) {
                widget.config.cooldown = fieldValues.customCooldown;
                widget.cooldownTime = fieldValues.customCooldown * 1000;
                console.log('[SE Widget] Using custom cooldown:', fieldValues.customCooldown, 'seconds');
            }
        }

        if (fieldValues.whoCanParticipate !== undefined) {
            widget.config.whoCanParticipate = fieldValues.whoCanParticipate;
            console.log('[SE Widget] Override whoCanParticipate:', fieldValues.whoCanParticipate);
        }

        if (fieldValues.enableManualSpin !== undefined) {
            widget.config.enableManualSpin = fieldValues.enableManualSpin;
            console.log('[SE Widget] Override enableManualSpin:', fieldValues.enableManualSpin);
        }

        if (fieldValues.spinSpeed !== undefined) {
            widget.config.spinSpeed = fieldValues.spinSpeed;
            console.log('[SE Widget] Override spinSpeed:', fieldValues.spinSpeed);
        }

        if (fieldValues.minimumSpinCount !== undefined) {
            widget.config.minimumSpinCount = fieldValues.minimumSpinCount;
            console.log('[SE Widget] Override minimumSpinCount:', fieldValues.minimumSpinCount);
        }

        if (fieldValues.pointsThreshold !== undefined) {
            widget.config.pointsThreshold = fieldValues.pointsThreshold;
            console.log('[SE Widget] Override pointsThreshold:', fieldValues.pointsThreshold);
        }

        // Tracking options
        if (fieldValues.trackTips !== undefined) {
            widget.config.trackTips = fieldValues.trackTips;
            console.log('[SE Widget] Override trackTips:', fieldValues.trackTips);
        }

        if (fieldValues.trackSubscriptions !== undefined) {
            widget.config.trackSubscriptions = fieldValues.trackSubscriptions;
            console.log('[SE Widget] Override trackSubscriptions:', fieldValues.trackSubscriptions);
        }

        if (fieldValues.trackResubscriptions !== undefined) {
            widget.config.trackResubscriptions = fieldValues.trackResubscriptions;
            console.log('[SE Widget] Override trackResubscriptions:', fieldValues.trackResubscriptions);
        }

        if (fieldValues.trackGiftSubs !== undefined) {
            widget.config.trackGiftSubs = fieldValues.trackGiftSubs;
            console.log('[SE Widget] Override trackGiftSubs:', fieldValues.trackGiftSubs);
        }

        if (fieldValues.trackDirectGifts !== undefined) {
            widget.config.trackDirectGifts = fieldValues.trackDirectGifts;
            console.log('[SE Widget] Override trackDirectGifts:', fieldValues.trackDirectGifts);
        }

        if (fieldValues.trackCheers !== undefined) {
            widget.config.trackCheers = fieldValues.trackCheers;
            console.log('[SE Widget] Override trackCheers:', fieldValues.trackCheers);
        }

        // Point system configuration
        if (fieldValues.pointsPerTip !== undefined) {
            widget.config.pointsPerTip = fieldValues.pointsPerTip;
            console.log('[SE Widget] Override pointsPerTip:', fieldValues.pointsPerTip);
        }

        if (fieldValues.pointsPerFollow !== undefined) {
            widget.config.pointsPerFollow = fieldValues.pointsPerFollow;
            console.log('[SE Widget] Override pointsPerFollow:', fieldValues.pointsPerFollow);
        }

        if (fieldValues.pointsPerSub !== undefined) {
            widget.config.pointsPerSub = fieldValues.pointsPerSub;
            console.log('[SE Widget] Override pointsPerSub:', fieldValues.pointsPerSub);
        }

        if (fieldValues.pointsPerResub !== undefined) {
            widget.config.pointsPerResub = fieldValues.pointsPerResub;
            console.log('[SE Widget] Override pointsPerResub:', fieldValues.pointsPerResub);
        }

        if (fieldValues.pointsPerGift !== undefined) {
            widget.config.pointsPerGift = fieldValues.pointsPerGift;
            console.log('[SE Widget] Override pointsPerGift:', fieldValues.pointsPerGift);
        }

        if (fieldValues.pointsPerDirectGift !== undefined) {
            widget.config.pointsPerDirectGift = fieldValues.pointsPerDirectGift;
            console.log('[SE Widget] Override pointsPerDirectGift:', fieldValues.pointsPerDirectGift);
        }

        if (fieldValues.pointsPerCheer !== undefined) {
            widget.config.pointsPerCheer = fieldValues.pointsPerCheer;
            console.log('[SE Widget] Override pointsPerCheer:', fieldValues.pointsPerCheer);
        }

        // Message format configuration
        if (fieldValues.subMessageFormat !== undefined && fieldValues.subMessageFormat !== '') {
            widget.config.subMessageFormat = fieldValues.subMessageFormat;
            console.log('[SE Widget] Override subMessageFormat:', fieldValues.subMessageFormat);
        }

        if (fieldValues.resubMessageFormat !== undefined && fieldValues.resubMessageFormat !== '') {
            widget.config.resubMessageFormat = fieldValues.resubMessageFormat;
            console.log('[SE Widget] Override resubMessageFormat:', fieldValues.resubMessageFormat);
        }

        // Center button configuration
        if (fieldValues.centerImageType !== undefined) {
            widget.centerButton.type = fieldValues.centerImageType;
            console.log('[SE Widget] Override centerImageType:', fieldValues.centerImageType);
        }

        if (fieldValues.centerCustomImage !== undefined && fieldValues.centerCustomImage !== '') {
            widget.centerButton.customImage = fieldValues.centerCustomImage;
            console.log('[SE Widget] Override centerCustomImage:', fieldValues.centerCustomImage);
        }

        if (fieldValues.centerImageSize !== undefined) {
            widget.centerButton.imageSize = fieldValues.centerImageSize;
            console.log('[SE Widget] Override centerImageSize:', fieldValues.centerImageSize);
        }

        if (fieldValues.centerCustomText !== undefined && fieldValues.centerCustomText !== '') {
            widget.centerButton.customText = fieldValues.centerCustomText;
            console.log('[SE Widget] Override centerCustomText:', fieldValues.centerCustomText);
        }

        if (fieldValues.centerTextSize !== undefined) {
            widget.centerButton.textSize = fieldValues.centerTextSize;
            console.log('[SE Widget] Override centerTextSize:', fieldValues.centerTextSize);
        }

        if (fieldValues.centerTextColor !== undefined && fieldValues.centerTextColor !== '') {
            widget.centerButton.textColor = fieldValues.centerTextColor;
            console.log('[SE Widget] Override centerTextColor:', fieldValues.centerTextColor);
        }

        if (fieldValues.enableWinnerPopup !== undefined) {
            widget.config.enableWinnerPopup = fieldValues.enableWinnerPopup;
            console.log('[SE Widget] Override enableWinnerPopup:', fieldValues.enableWinnerPopup);
        }

        if (fieldValues.enableConfetti !== undefined) {
            widget.config.enableConfetti = fieldValues.enableConfetti;
            console.log('[SE Widget] Override enableConfetti:', fieldValues.enableConfetti);
        }

        // Font settings configuration
        if (fieldValues.wheelTextFont !== undefined && fieldValues.wheelTextFont !== '') {
            widget.fontSettings.wheelTextFont = fieldValues.wheelTextFont;
            console.log('[SE Widget] Override wheelTextFont:', fieldValues.wheelTextFont);
        }

        if (fieldValues.customFontFamily !== undefined && fieldValues.customFontFamily !== '') {
            widget.fontSettings.customFontFamily = fieldValues.customFontFamily;
            console.log('[SE Widget] Override customFontFamily:', fieldValues.customFontFamily);
        }

        if (fieldValues.wheelTextSize !== undefined) {
            widget.fontSettings.wheelTextSize = fieldValues.wheelTextSize;
            console.log('[SE Widget] Override wheelTextSize:', fieldValues.wheelTextSize);
        }

        if (fieldValues.wheelTextWeight !== undefined && fieldValues.wheelTextWeight !== '') {
            widget.fontSettings.wheelTextWeight = fieldValues.wheelTextWeight;
            console.log('[SE Widget] Override wheelTextWeight:', fieldValues.wheelTextWeight);
        }

        if (fieldValues.wheelTextStyle !== undefined && fieldValues.wheelTextStyle !== '') {
            widget.fontSettings.wheelTextStyle = fieldValues.wheelTextStyle;
            console.log('[SE Widget] Override wheelTextStyle:', fieldValues.wheelTextStyle);
        }

        if (fieldValues.wheelTextTransform !== undefined && fieldValues.wheelTextTransform !== '') {
            widget.fontSettings.wheelTextTransform = fieldValues.wheelTextTransform;
            console.log('[SE Widget] Override wheelTextTransform:', fieldValues.wheelTextTransform);
        }

        if (fieldValues.wheelTextLetterSpacing !== undefined) {
            widget.fontSettings.wheelTextLetterSpacing = fieldValues.wheelTextLetterSpacing;
            console.log('[SE Widget] Override wheelTextLetterSpacing:', fieldValues.wheelTextLetterSpacing);
        }

        if (fieldValues.enableTextShadow !== undefined) {
            widget.fontSettings.enableTextShadow = fieldValues.enableTextShadow;
            console.log('[SE Widget] Override enableTextShadow:', fieldValues.enableTextShadow);
        }

        if (fieldValues.textShadowColor !== undefined && fieldValues.textShadowColor !== '') {
            widget.fontSettings.textShadowColor = fieldValues.textShadowColor;
            console.log('[SE Widget] Override textShadowColor:', fieldValues.textShadowColor);
        }

        if (fieldValues.textShadowBlur !== undefined) {
            widget.fontSettings.textShadowBlur = fieldValues.textShadowBlur;
            console.log('[SE Widget] Override textShadowBlur:', fieldValues.textShadowBlur);
        }

        if (fieldValues.textShadowOffsetX !== undefined) {
            widget.fontSettings.textShadowOffsetX = fieldValues.textShadowOffsetX;
            console.log('[SE Widget] Override textShadowOffsetX:', fieldValues.textShadowOffsetX);
        }

        if (fieldValues.textShadowOffsetY !== undefined) {
            widget.fontSettings.textShadowOffsetY = fieldValues.textShadowOffsetY;
            console.log('[SE Widget] Override textShadowOffsetY:', fieldValues.textShadowOffsetY);
        }

        if (fieldValues.enableTextStroke !== undefined) {
            widget.fontSettings.enableTextStroke = fieldValues.enableTextStroke;
            console.log('[SE Widget] Override enableTextStroke:', fieldValues.enableTextStroke);
        }

        if (fieldValues.textStrokeColor !== undefined && fieldValues.textStrokeColor !== '') {
            widget.fontSettings.textStrokeColor = fieldValues.textStrokeColor;
            console.log('[SE Widget] Override textStrokeColor:', fieldValues.textStrokeColor);
        }

        if (fieldValues.textStrokeWidth !== undefined) {
            widget.fontSettings.textStrokeWidth = fieldValues.textStrokeWidth;
            console.log('[SE Widget] Override textStrokeWidth:', fieldValues.textStrokeWidth);
        }

        // Override wheel options - handle multiple formats
        if (fieldValues.wheelOptions !== undefined && fieldValues.wheelOptions !== '') {
            let options = [];

            console.log('[SE Widget] Raw wheelOptions from fieldData:', fieldValues.wheelOptions);
            console.log('[SE Widget] Type of wheelOptions:', typeof fieldValues.wheelOptions);

            // Try comma-separated first
            if (typeof fieldValues.wheelOptions === 'string' && fieldValues.wheelOptions.includes(',')) {
                options = fieldValues.wheelOptions.split(',').map(s => s.trim()).filter(s => s.length > 0);
                console.log('[SE Widget] Parsed as comma-separated:', options);
            }
            // Try line-separated
            else if (typeof fieldValues.wheelOptions === 'string' && fieldValues.wheelOptions.includes('\n')) {
                options = fieldValues.wheelOptions.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                console.log('[SE Widget] Parsed as line-separated:', options);
            }
            // Try array format
            else if (Array.isArray(fieldValues.wheelOptions)) {
                options = fieldValues.wheelOptions.filter(s => s && s.trim().length > 0);
                console.log('[SE Widget] Used as array:', options);
            }
            // Single string
            else if (typeof fieldValues.wheelOptions === 'string' && fieldValues.wheelOptions.trim()) {
                options = [fieldValues.wheelOptions.trim()];
                console.log('[SE Widget] Used as single string:', options);
            }

            if (options.length > 0) {
                widget.wheelOptions = options;
                console.log('[SE Widget] Successfully overrode wheelOptions:', widget.wheelOptions);
            } else {
                console.warn('[SE Widget] No valid options found in fieldData, keeping defaults');
            }
        }

        // Override colors - validate hex format
        const newColors = [];

        if (fieldValues.primaryColor !== undefined && fieldValues.primaryColor !== '') {
            console.log('[SE Widget] Raw primaryColor from fieldData:', fieldValues.primaryColor);
            if (/^#[0-9A-F]{6}$/i.test(fieldValues.primaryColor)) {
                newColors.push(fieldValues.primaryColor);
                console.log('[SE Widget] Valid primaryColor:', fieldValues.primaryColor);
            } else {
                console.warn('[SE Widget] Invalid primaryColor format:', fieldValues.primaryColor);
                newColors.push(widget.wheelColors[0]); // Keep current primary
            }
        } else {
            newColors.push(widget.wheelColors[0]); // Keep current primary
        }

        if (fieldValues.secondaryColor !== undefined && fieldValues.secondaryColor !== '') {
            console.log('[SE Widget] Raw secondaryColor from fieldData:', fieldValues.secondaryColor);
            if (/^#[0-9A-F]{6}$/i.test(fieldValues.secondaryColor)) {
                newColors.push(fieldValues.secondaryColor);
                console.log('[SE Widget] Valid secondaryColor:', fieldValues.secondaryColor);
            } else {
                console.warn('[SE Widget] Invalid secondaryColor format:', fieldValues.secondaryColor);
                newColors.push(widget.wheelColors[1] || '#a4a0ec'); // Keep current or default secondary
            }
        } else {
            newColors.push(widget.wheelColors[1] || '#a4a0ec'); // Keep current or default secondary
        }

        // Only update colors if we have valid ones
        if (newColors.length >= 2) {
            widget.wheelColors = newColors;
            console.log('[SE Widget] Successfully overrode wheelColors:', widget.wheelColors);
        }

        console.log('[SE Widget] Final configuration after override:', {
            config: widget.config,
            wheelOptions: widget.wheelOptions,
            wheelColors: widget.wheelColors
        });

        widget.initialized = true;

    } catch (error) {
        console.error('[SE Widget] Error processing fieldData:', error);
    }
}

// Load custom font if specified
function loadCustomFont() {
    if (widget.fontSettings.customFontFamily && widget.fontSettings.customFontFamily.trim() !== '') {
        const fontName = widget.fontSettings.customFontFamily.trim();

        // Check if it's a Google Font (simple heuristic)
        if (!fontName.includes('http') && !fontName.includes('.')) {
            // Assume it's a Google Font
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName.replace(/\s+/g, '+'))}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            console.log('[SE Widget] Loading Google Font:', fontName);
        } else if (fontName.includes('http')) {
            // Assume it's a direct font URL
            const link = document.createElement('link');
            link.href = fontName;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            console.log('[SE Widget] Loading custom font from URL:', fontName);
        }
    }
}

// Apply custom colors to wheel elements
function applyCustomStyling() {
    // Apply border color to wheel container
    $('#wheel').css('border-color', widget.customColors.borderColor);

    // Apply inner ring color
    $('.inner-ring, #inner-wheel::before').css('background-color', widget.customColors.innerRingColor);

    // Apply outer ring color
    $('.outer-ring, #wheel::after').css('background-color', widget.customColors.outerRingColor);

    // Apply icon/pointer color
    $('.pointer, .spin-icon').css('color', widget.customColors.iconColor);

    // Apply highlighter color to active elements
    $('.highlighter, .active-section').css('background-color', widget.customColors.highlighterColor);

    // Apply star colors
    $('.star, .decoration-star').css('fill', widget.customColors.starColor);

    console.log('[SE Widget] Applied custom styling');
}

// Get font family for wheel text
function getFontFamily() {
    if (widget.fontSettings.customFontFamily && widget.fontSettings.customFontFamily.trim() !== '') {
        return `"${widget.fontSettings.customFontFamily}", ${widget.fontSettings.wheelTextFont}, sans-serif`;
    }
    return `${widget.fontSettings.wheelTextFont}, sans-serif`;
}

// Build text shadow CSS
function getTextShadow() {
    if (!widget.fontSettings.enableTextShadow) return 'none';

    return `${widget.fontSettings.textShadowOffsetX}px ${widget.fontSettings.textShadowOffsetY}px ${widget.fontSettings.textShadowBlur}px ${widget.fontSettings.textShadowColor}`;
}

// Build text stroke CSS (using -webkit-text-stroke)
function getTextStroke() {
    if (!widget.fontSettings.enableTextStroke) return {};

    return {
        '-webkit-text-stroke': `${widget.fontSettings.textStrokeWidth}px ${widget.fontSettings.textStrokeColor}`,
        'text-stroke': `${widget.fontSettings.textStrokeWidth}px ${widget.fontSettings.textStrokeColor}`
    };
}

// Populate wheel sections
function populateWheel() {
    console.log('[SE Widget] Populating wheel with options:', widget.wheelOptions);

    const innerWheel = $('#inner-wheel');
    if (innerWheel.length === 0) {
        console.error('[SE Widget] #inner-wheel element not found!');
        return;
    }

    const numberOfSections = widget.wheelOptions.length;
    const rotationPerSection = 360 / numberOfSections;

    // Clear existing sections
    innerWheel.empty();

    // Create sections
    widget.wheelOptions.forEach((option, index) => {
        const rotation = index * rotationPerSection;
        const colorIndex = index % widget.wheelColors.length;

        const section = $('<div class="sec"></div>');

        // Dynamic sizing based on number of sections
        const borderWidthTop = numberOfSections <= 8 ? 130 : Math.max(100, 160 - (numberOfSections * 3));
        const borderWidthSide = numberOfSections <= 8 ? 58 : Math.max(40, 70 - (numberOfSections * 1.5));

        const sectionStyles = {
            'position': 'absolute',
            'width': '0',
            'height': '0',
            'border-style': 'solid',
            'border-width': `${borderWidthTop}px ${borderWidthSide}px 0`,
            'border-color': `${widget.wheelColors[colorIndex]} transparent`,
            'transform-origin': `${borderWidthSide}px ${borderWidthTop - 1}px`,
            'left': `${125 - borderWidthSide}px`,
            'top': `${-4}px`,
            'opacity': '1',
            'transform': `rotate(${rotation}deg)`,
            '-webkit-transform': `rotate(${rotation}deg)`,
            '-moz-transform': `rotate(${rotation}deg)`,
            '-o-transform': `rotate(${rotation}deg)`,
            '-ms-transform': `rotate(${rotation}deg)`
        };

        section.css(sectionStyles);

        // Add text with custom font styling
        const baseFontSize = widget.fontSettings.wheelTextSize;
        const scaledFontSize = numberOfSections > 12 ? Math.max(8, baseFontSize - 4) :
            numberOfSections > 8 ? Math.max(10, baseFontSize - 2) : baseFontSize;

        const textStyles = {
            'font-size': `${scaledFontSize}px`,
            'font-family': getFontFamily(),
            'font-weight': widget.fontSettings.wheelTextWeight,
            'font-style': widget.fontSettings.wheelTextStyle,
            'text-transform': widget.fontSettings.wheelTextTransform,
            'letter-spacing': `${widget.fontSettings.wheelTextLetterSpacing}px`,
            'color': widget.customColors.textColor,
            'text-shadow': getTextShadow(),
            ...getTextStroke()
        };

        const contentSpan = $(`<span class="content-text">${option}</span>`);
        contentSpan.css(textStyles);
        section.append(contentSpan);

        innerWheel.append(section);
    });

    console.log(`[SE Widget] Wheel populated with ${numberOfSections} sections`);
}

// Initialize center button based on configuration
function initializeCenterButton() {
    console.log('[SE Widget] Initializing center button with config:', widget.centerButton);

    // Hide all center content elements first
    $('.center-content').hide();

    const centerType = widget.centerButton.type;
    const customImage = widget.centerButton.customImage;
    const imageSize = widget.centerButton.imageSize;
    const customText = widget.centerButton.customText;
    const textSize = widget.centerButton.textSize;
    const textColor = widget.centerButton.textColor;

    switch (centerType) {
        case 'image':
            if (customImage && customImage.trim() !== '') {
                const $centerImageDiv = $('#center-image');
                const $centerImageImg = $centerImageDiv.find('img');

                // Add error handler for image loading
                $centerImageImg.off('error').on('error', function () {
                    console.warn('[SE Widget] Failed to load custom image, falling back to star');
                    $centerImageDiv.hide();
                    $('#center-star').show();
                });

                // Add load handler for successful loading
                $centerImageImg.off('load').on('load', function () {
                    console.log('[SE Widget] Custom image loaded successfully');
                });

                $centerImageImg.attr('src', customImage);
                $centerImageImg.css({
                    'max-width': imageSize + '%',
                    'max-height': imageSize + '%'
                });
                $centerImageDiv.show();
                console.log('[SE Widget] Showing custom image:', customImage);
            } else {
                // Fallback to star if no image provided
                $('#center-star').show();
                console.log('[SE Widget] No custom image provided, showing star');
            }
            break;

        case 'text':
            const $centerText = $('#center-text');
            $centerText.text(customText);
            $centerText.css({
                'font-size': textSize + 'px',
                'color': textColor
            });
            $centerText.show();
            console.log('[SE Widget] Showing custom text:', customText);
            break;

        case 'star':
        default:
            // Apply star color if configured
            if (widget.customColors.starColor) {
                $('#center-star svg path').attr('fill', widget.customColors.starColor);
            }
            $('#center-star').show();
            console.log('[SE Widget] Showing default star');
            break;
    }
}

// Get winning option
function getWinningOption(finalDegree) {
    const numberOfSections = widget.wheelOptions.length;
    const rotationPerSection = 360 / numberOfSections;
    const normalizedDegree = (360 - (finalDegree % 360)) % 360;
    const winningIndex = Math.floor(normalizedDegree / rotationPerSection);
    return widget.wheelOptions[winningIndex] || widget.wheelOptions[0];
}

// Perform spin
function performSpin() {
    if (widget.isSpinning) return;

    widget.isSpinning = true;
    widget.clicks++;

    const newDegree = widget.degree * widget.clicks;
    const extraDegree = Math.floor(Math.random() * 360) + 1;
    const totalDegree = newDegree + extraDegree;

    // Get spin duration based on speed setting
    let spinDuration = 6000; // default normal speed
    switch (widget.config.spinSpeed) {
        case 'slow':
            spinDuration = 8000;
            break;
        case 'fast':
            spinDuration = 4000;
            break;
        default:
            spinDuration = 6000;
            break;
    }

    // Apply rotation
    $('#inner-wheel').css({
        'transform': `rotate(${totalDegree}deg)`,
        'transition': `transform ${spinDuration / 1000}s cubic-bezier(0.23, 1, 0.32, 1)`
    });

    // Spin button animation
    $('#wheel .sec').each(function () {
        const t = $(this);
        let c = 0;
        const n = 700;

        const interval = setInterval(() => {
            c++;
            if (c === n) clearInterval(interval);

            const aoY = t.offset().top;
            if (aoY < 23.89) {
                $('#spin').addClass('spin');
                setTimeout(() => $('#spin').removeClass('spin'), 100);
            }
        }, 10);
    });

    // Show winner after animation
    setTimeout(() => {
        widget.winnerText = getWinningOption(totalDegree);
        console.log('[SE Widget] Winner:', widget.winnerText);
        showWinner();
        widget.isSpinning = false;
    }, spinDuration);
}

// Show winner
function showWinner() {
    console.log('[SE Widget] Showing winner:', widget.winnerText);

    // StreamElements alert
    if (typeof SE_API !== 'undefined' && SE_API.showAlert) {
        const alertMsg = `🎉 ${widget.currentUser ? widget.currentUser + ' won: ' : 'Winner: '}${widget.winnerText}!`;
        SE_API.showAlert(alertMsg);
    }

    // Confetti
    if (widget.config.enableConfetti && typeof confetti !== 'undefined') {
        createConfetti();
    }

    // Popup modal
    if (widget.config.enableWinnerPopup) {
        $('#winner-text').text(widget.winnerText);
        $('#winner-display').removeClass('hidden').addClass('show');
    }
}

// Create confetti
function createConfetti() {
    if (typeof confetti === 'undefined') return;

    const confettiColors = [
        widget.customColors.confettiColor1,
        widget.customColors.confettiColor2,
        '#f39c12', '#e74c3c', '#2ecc71'
    ];

    // Initial burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors
    });

    // Side bursts
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: confettiColors
        });
    }, 200);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: confettiColors
        });
    }, 400);
}

// Handle chat commands
function handleChatMessage(data) {
    if (!widget.config.enableSpinCommand) return;

    const message = (data.text || '').trim().toLowerCase();
    const username = data.displayName || data.username || data.nick || 'Unknown';

    if (message === widget.config.spinCommand) {
        handleSpinCommand(username, data);
    }
}

// Handle spin command with permissions
function handleSpinCommand(username, data) {
    if (widget.isSpinning) {
        console.log('[SE Widget] Wheel is already spinning');
        return;
    }

    // Cooldown check
    const now = Date.now();
    if (now - widget.lastSpinTime < widget.cooldownTime) {
        const remainingTime = Math.ceil((widget.cooldownTime - (now - widget.lastSpinTime)) / 1000);
        console.log(`[SE Widget] Spin on cooldown for ${remainingTime}s`);
        return;
    }

    // Permission checks based on whoCanParticipate setting
    const userTags = data.tags || {};
    const userBadges = userTags.badges || '';

    // Check if user is broadcaster
    const isBroadcaster = userTags.mod === '1' && userBadges.includes('broadcaster');

    // Check if user is moderator
    const isModerator = userTags.mod === '1' || userBadges.includes('moderator');

    // Check if user is VIP
    const isVIP = userTags.vip === '1' || userBadges.includes('vip');

    // Check if user is subscriber
    const isSubscriber = userTags.subscriber === '1' || userBadges.includes('subscriber');

    // Permission logic based on whoCanParticipate setting
    let hasPermission = false;

    switch (widget.config.whoCanParticipate) {
        case 'broadcaster':
            hasPermission = isBroadcaster;
            break;
        case 'mods':
            hasPermission = isBroadcaster || isModerator;
            break;
        case 'vips':
            hasPermission = isBroadcaster || isModerator || isVIP;
            break;
        case 'subscribers':
            hasPermission = isBroadcaster || isModerator || isVIP || isSubscriber;
            break;
        case 'everyone':
        default:
            hasPermission = true;
            break;
    }

    if (!hasPermission) {
        console.log(`[SE Widget] ${username} does not have permission to spin (required: ${widget.config.whoCanParticipate})`);
        return;
    }

    console.log(`[SE Widget] ${username} triggered a spin!`);
    widget.currentUser = username;
    widget.lastSpinTime = now;
    performSpin();
}

// StreamElements Event Listeners - Standard Pattern
window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail || !obj.detail.event) return;

    const event = obj.detail.event;
    const listener = obj.detail.listener;

    console.log('[SE Widget] onEventReceived:', listener, event);

    // Handle chat messages for spin commands
    if (listener === 'message') {
        handleChatMessage(event.data || {});
    }

    // Handle tracking events
    if (widget.config.trackTips && listener === 'tip') {
        handleTrackingEvent('tip', event.data);
    }

    if (listener === 'follow') {
        handleTrackingEvent('follow', event.data);
    }

    if (widget.config.trackSubscriptions && listener === 'subscriber') {
        handleTrackingEvent('subscription', event.data);
    }

    if (widget.config.trackResubscriptions && listener === 'resub') {
        handleTrackingEvent('resubscription', event.data);
    }

    if (widget.config.trackGiftSubs && listener === 'subgift') {
        handleTrackingEvent('gift_sub', event.data);
    }

    if (widget.config.trackDirectGifts && listener === 'gift') {
        handleTrackingEvent('direct_gift', event.data);
    }

    if (widget.config.trackCheers && listener === 'cheer') {
        handleTrackingEvent('cheer', event.data);
    }
});

// Handle tracking events
function handleTrackingEvent(eventType, data) {
    console.log(`[SE Widget] Tracking ${eventType}:`, data);

    const username = data.displayName || data.username || data.name || 'Unknown';
    let rawAmount = data.amount || 0;
    let calculatedPoints = 0;
    let message = '';

    // Calculate points based on event type and point system
    switch (eventType) {
        case 'tip':
            calculatedPoints = rawAmount * widget.config.pointsPerTip;
            message = `💰 ${username} tipped $${rawAmount} (${calculatedPoints} points)`;
            break;
        case 'follow':
            calculatedPoints = widget.config.pointsPerFollow;
            message = `👥 ${username} followed (${calculatedPoints} points)`;
            break;
        case 'subscription':
            calculatedPoints = widget.config.pointsPerSub;
            message = widget.config.subMessageFormat.replace('<username>', username);
            break;
        case 'resubscription':
            calculatedPoints = widget.config.pointsPerResub;
            message = widget.config.resubMessageFormat.replace('<username>', username);
            break;
        case 'gift_sub':
            calculatedPoints = widget.config.pointsPerGift;
            message = `🎁 ${username} gifted a sub (${calculatedPoints} points)`;
            break;
        case 'direct_gift':
            calculatedPoints = widget.config.pointsPerDirectGift;
            message = `🎁 ${username} sent a direct gift (${calculatedPoints} points)`;
            break;
        case 'cheer':
            // Cheers are calculated per 100 bits
            calculatedPoints = Math.floor(rawAmount / 100) * widget.config.pointsPerCheer;
            message = `🎉 ${username} cheered ${rawAmount} bits (${calculatedPoints} points)`;
            break;
        default:
            calculatedPoints = rawAmount;
            message = `⭐ ${username} triggered ${eventType} (${calculatedPoints} points)`;
            break;
    }

    console.log(`[SE Widget] ${eventType}: ${calculatedPoints} points calculated from ${rawAmount} raw amount`);

    // Check if event meets minimum spin threshold
    if (calculatedPoints >= widget.config.pointsThreshold) {
        console.log(`[SE Widget] ${eventType} from ${username} (${calculatedPoints} points) qualifies for automatic spin!`);

        // Check minimum spin count
        if (widget.clicks < widget.config.minimumSpinCount) {
            console.log(`[SE Widget] Not enough spins yet (${widget.clicks}/${widget.config.minimumSpinCount})`);
            return;
        }

        // Trigger automatic spin
        if (!widget.isSpinning) {
            widget.currentUser = username;
            widget.lastSpinTime = Date.now();
            performSpin();

            // Show tracking message with custom format
            if (typeof SE_API !== 'undefined' && SE_API.showAlert) {
                SE_API.showAlert(`🎉 ${message} - Spin triggered!`);
            }
        }
    } else {
        console.log(`[SE Widget] ${eventType} from ${username} (${calculatedPoints} points) below threshold (${widget.config.pointsThreshold})`);

        // Still show the event message even if no spin
        if (typeof SE_API !== 'undefined' && SE_API.showAlert) {
            SE_API.showAlert(message);
        }
    }
}

// Function to update center button (can be called externally)
window.updateCenterButton = function (type, value, options = {}) {
    console.log('[SE Widget] Updating center button:', { type, value, options });

    switch (type) {
        case 'image':
            widget.centerButton.type = 'image';
            widget.centerButton.customImage = value;
            if (options.size) widget.centerButton.imageSize = options.size;
            break;
        case 'text':
            widget.centerButton.type = 'text';
            widget.centerButton.customText = value;
            if (options.size) widget.centerButton.textSize = options.size;
            if (options.color) widget.centerButton.textColor = options.color;
            break;
        case 'star':
        default:
            widget.centerButton.type = 'star';
            if (options.color) widget.customColors.starColor = options.color;
            break;
    }

    initializeCenterButton();
    console.log('[SE Widget] Center button updated successfully');
};

// Function to handle custom image upload (for testing)
window.uploadCustomImage = function () {
    const fileInput = document.getElementById('image-upload');
    if (!fileInput) {
        console.warn('[SE Widget] Image upload input not found');
        return;
    }

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            window.updateCenterButton('image', imageDataUrl, { size: 70 });
            console.log('[SE Widget] Custom image uploaded and applied');
        };
        reader.readAsDataURL(file);
    } else {
        console.warn('[SE Widget] No file selected for upload');
    }
};

// Initialize widget
function initializeWidget() {
    console.log('[SE Widget] Initializing widget...');

    // Ensure jQuery is available
    if (typeof $ === 'undefined') {
        console.error('[SE Widget] jQuery not found! Make sure jQuery is loaded in HTML tab.');
        return;
    }

    // Load custom fonts if specified
    loadCustomFont();

    // Populate wheel with current configuration
    populateWheel();

    // Apply custom color styling
    applyCustomStyling();

    // Initialize center button
    initializeCenterButton();

    // Set up click handlers
    $(document).ready(function () {
        // Manual spin button - only if enabled
        if (widget.config.enableManualSpin) {
            $('#spin').off('click').on('click', function () {
                if (!widget.isSpinning) {
                    widget.currentUser = 'Manual Spin';
                    performSpin();
                }
            });
        } else {
            // Disable manual spin button
            $('#spin').off('click').css({
                'opacity': '0.5',
                'cursor': 'not-allowed'
            });
        }

        $('#close-winner').off('click').on('click', function () {
            $('#winner-display').removeClass('show').addClass('hidden');
        });
    });

    console.log('[SE Widget] Widget initialized successfully');
}

console.log('[SE Widget] Script loaded successfully');
