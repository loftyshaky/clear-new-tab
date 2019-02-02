'use_strict';

import React from 'react';
import { render } from 'react-dom';

import 'js/error';

import { Error } from 'js/components/Error';

render(
    <Error />, // eslint-disable-line react/jsx-filename-extension
    s('#err'),
);
