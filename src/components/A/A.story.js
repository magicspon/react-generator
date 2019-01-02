import React from 'react'
import { storiesOf } from '@storybook/react'
import A from './A.js'

storiesOf('A', module)
	.add('default', () => (
		<A />
	))
