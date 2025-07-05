// Comprehensive Educational Content Service
export interface EducationalContent {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  contentType: 'theory' | 'example' | 'practice' | 'revision';
  content: {
    theory?: string;
    examples?: Array<{
      title: string;
      problem: string;
      solution: string;
      explanation: string;
    }>;
    practiceQuestions?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }>;
    keyPoints?: string[];
    formulas?: Array<{
      name: string;
      formula: string;
      description: string;
    }>;
  };
  estimatedReadTime: number;
  prerequisites: string[];
  nextTopics: string[];
  examRelevance: {
    jeeMain: number;
    jeeAdvanced: number;
    neet: number;
  };
  lastUpdated: Date;
}

class ContentService {
  private static instance: ContentService;
  private content: Map<string, EducationalContent> = new Map();

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
      ContentService.instance.initializeContent();
    }
    return ContentService.instance;
  }

  private initializeContent(): void {
    // PHYSICS CONTENT - ALL LEVELS
    
    // MECHANICS - Foundation Level
    this.addContent({
      id: 'phy-mech-kinematics-1d-foundation',
      title: 'Motion in a Straight Line - Basics',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `# Motion in a Straight Line - Foundation

## Introduction
Motion is one of the most fundamental concepts in physics. When we observe objects around us, we notice that they are either at rest or in motion. Understanding motion helps us describe and predict the behavior of objects in our universe.

## Basic Concepts

### Position and Displacement
- **Position**: The location of an object at any given time
- **Displacement**: The change in position of an object
- **Distance**: The total path length traveled by an object

### Velocity and Speed
- **Speed**: The rate of change of distance with time (scalar quantity)
- **Velocity**: The rate of change of displacement with time (vector quantity)
- **Average velocity** = Total displacement / Total time
- **Instantaneous velocity**: Velocity at a particular instant

### Acceleration
- **Acceleration**: The rate of change of velocity with time
- **Average acceleration** = Change in velocity / Time taken
- **Uniform acceleration**: When acceleration remains constant

## Kinematic Equations for Uniform Acceleration
When an object moves with constant acceleration, we can use these fundamental equations:

1. **v = u + at**
   - v = final velocity
   - u = initial velocity  
   - a = acceleration
   - t = time

2. **s = ut + ½at²**
   - s = displacement

3. **v² = u² + 2as**

4. **s = (u + v)t/2**

## Graphical Representation
- **Position-time graph**: Shows how position changes with time
- **Velocity-time graph**: Shows how velocity changes with time
- **Acceleration-time graph**: Shows how acceleration changes with time

## Real-World Applications
- Car braking and acceleration
- Free fall of objects
- Motion of trains and aircraft
- Sports and athletics

Understanding these basics is crucial for solving more complex problems in mechanics and forms the foundation for all of physics.`,
        
        examples: [
          {
            title: 'Basic Velocity Calculation',
            problem: 'A car travels 100 meters in 10 seconds. What is its average velocity?',
            solution: 'Average velocity = Total displacement / Total time\nAverage velocity = 100 m / 10 s = 10 m/s',
            explanation: 'Since the car travels in a straight line, displacement equals distance. We simply divide the distance by time to get average velocity.'
          },
          {
            title: 'Acceleration Problem',
            problem: 'A bicycle accelerates from rest to 20 m/s in 5 seconds. Find its acceleration.',
            solution: 'Given: u = 0 m/s, v = 20 m/s, t = 5 s\nUsing v = u + at\n20 = 0 + a(5)\na = 20/5 = 4 m/s²',
            explanation: 'We use the first kinematic equation since we know initial velocity, final velocity, and time.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'A train travels 120 km in 2 hours. What is its average speed?',
            options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
            correctAnswer: 1,
            explanation: 'Average speed = Total distance / Total time = 120 km / 2 h = 60 km/h',
            difficulty: 'Easy'
          },
          {
            question: 'An object starts from rest and accelerates at 2 m/s² for 4 seconds. What is its final velocity?',
            options: ['6 m/s', '8 m/s', '10 m/s', '12 m/s'],
            correctAnswer: 1,
            explanation: 'Using v = u + at, where u = 0, a = 2 m/s², t = 4 s: v = 0 + 2(4) = 8 m/s',
            difficulty: 'Easy'
          }
        ],
        
        keyPoints: [
          'Motion is relative - it depends on the reference frame',
          'Displacement can be positive, negative, or zero',
          'Velocity is a vector quantity with both magnitude and direction',
          'Acceleration can be positive (speeding up) or negative (slowing down)',
          'Kinematic equations only apply for constant acceleration'
        ],
        
        formulas: [
          {
            name: 'Average Velocity',
            formula: 'v_avg = Δx/Δt',
            description: 'Change in position divided by change in time'
          },
          {
            name: 'First Kinematic Equation',
            formula: 'v = u + at',
            description: 'Relates final velocity, initial velocity, acceleration, and time'
          },
          {
            name: 'Second Kinematic Equation',
            formula: 's = ut + ½at²',
            description: 'Relates displacement, initial velocity, acceleration, and time'
          }
        ]
      },
      estimatedReadTime: 25,
      prerequisites: [],
      nextTopics: ['phy-mech-kinematics-1d-intermediate'],
      examRelevance: { jeeMain: 15, jeeAdvanced: 10, neet: 8 },
      lastUpdated: new Date()
    });

    // MECHANICS - Intermediate Level
    this.addContent({
      id: 'phy-mech-kinematics-1d-intermediate',
      title: 'Motion in a Straight Line - Advanced Concepts',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      difficulty: 'Intermediate',
      contentType: 'theory',
      content: {
        theory: `# Motion in a Straight Line - Intermediate

## Advanced Kinematic Concepts

### Relative Motion
When two objects are moving, their relative velocity is the velocity of one object as observed from the other object.

**Relative velocity formula:**
- If two objects A and B are moving with velocities v_A and v_B respectively
- Velocity of A relative to B: v_AB = v_A - v_B
- Velocity of B relative to A: v_BA = v_B - v_A

### Non-Uniform Motion
Real-world motion often involves changing acceleration. We need calculus-based approaches:

**Instantaneous velocity:** v = dx/dt
**Instantaneous acceleration:** a = dv/dt = d²x/dt²

### Motion Under Gravity
Free fall is a special case of uniformly accelerated motion:
- Acceleration due to gravity: g = 9.8 m/s² (downward)
- For upward motion: a = -g
- For downward motion: a = +g

### Advanced Problem-Solving Techniques

#### Multi-Stage Motion
Many problems involve different phases of motion with different accelerations.

#### Graphical Analysis
- Area under velocity-time graph = displacement
- Slope of position-time graph = velocity
- Slope of velocity-time graph = acceleration

### Projectile Motion Basics
While projectile motion is 2D, understanding the vertical component helps with 1D analysis:
- Vertical motion: uniformly accelerated with a = -g
- Time of flight, maximum height calculations

## Advanced Applications
- Elevator problems with varying acceleration
- Multi-object systems with constraints
- Motion with air resistance (qualitative)
- Collision and impact problems`,
        
        examples: [
          {
            title: 'Relative Motion Problem',
            problem: 'Two cars A and B are moving in the same direction with velocities 60 km/h and 40 km/h respectively. Find the velocity of A relative to B.',
            solution: 'v_A = 60 km/h, v_B = 40 km/h\nv_AB = v_A - v_B = 60 - 40 = 20 km/h\nCar A appears to move at 20 km/h relative to car B.',
            explanation: 'Since both cars move in the same direction, we subtract their velocities to find relative motion.'
          },
          {
            title: 'Free Fall Problem',
            problem: 'A ball is thrown upward with initial velocity 30 m/s. Find the maximum height reached and time to reach maximum height.',
            solution: 'At maximum height, v = 0\nUsing v² = u² + 2as:\n0 = (30)² + 2(-9.8)s\ns = 900/(2×9.8) = 45.9 m\n\nUsing v = u + at:\n0 = 30 + (-9.8)t\nt = 30/9.8 = 3.06 s',
            explanation: 'At maximum height, velocity becomes zero. We use kinematic equations with a = -g for upward motion.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'A stone is dropped from a height of 80 m. How long does it take to reach the ground?',
            options: ['3 s', '4 s', '5 s', '6 s'],
            correctAnswer: 1,
            explanation: 'Using s = ut + ½gt², where u = 0, s = 80 m, g = 10 m/s²: 80 = 0 + ½(10)t², t² = 16, t = 4 s',
            difficulty: 'Medium'
          },
          {
            question: 'Two trains approach each other with speeds 50 km/h and 70 km/h. What is their relative speed?',
            options: ['20 km/h', '60 km/h', '120 km/h', '140 km/h'],
            correctAnswer: 2,
            explanation: 'When objects move toward each other, relative speed = sum of individual speeds = 50 + 70 = 120 km/h',
            difficulty: 'Medium'
          }
        ],
        
        keyPoints: [
          'Relative motion depends on the reference frame chosen',
          'Free fall problems use g = 9.8 m/s² as acceleration',
          'At maximum height in projectile motion, vertical velocity = 0',
          'Graphical methods provide powerful problem-solving tools',
          'Multi-stage motion requires analyzing each phase separately'
        ],
        
        formulas: [
          {
            name: 'Relative Velocity',
            formula: 'v_AB = v_A - v_B',
            description: 'Velocity of A relative to B'
          },
          {
            name: 'Maximum Height (Projectile)',
            formula: 'h_max = u²sin²θ/(2g)',
            description: 'Maximum height reached in projectile motion'
          }
        ]
      },
      estimatedReadTime: 35,
      prerequisites: ['phy-mech-kinematics-1d-foundation'],
      nextTopics: ['phy-mech-kinematics-2d-foundation'],
      examRelevance: { jeeMain: 20, jeeAdvanced: 25, neet: 12 },
      lastUpdated: new Date()
    });

    // CHEMISTRY CONTENT - ALL LEVELS

    // ATOMIC STRUCTURE - Foundation
    this.addContent({
      id: 'chem-atomic-structure-foundation',
      title: 'Atomic Structure - Basic Concepts',
      subject: 'Chemistry',
      topic: 'Physical Chemistry',
      subtopic: 'Atomic Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `# Atomic Structure - Foundation

## Introduction to Atoms
Atoms are the fundamental building blocks of all matter. Understanding atomic structure is crucial for comprehending chemical behavior and bonding.

## Historical Development

### Dalton's Atomic Theory (1808)
- All matter consists of indivisible atoms
- Atoms of the same element are identical
- Atoms combine in simple ratios to form compounds
- Chemical reactions involve rearrangement of atoms

### Thomson's Model (1897)
- Discovery of electrons
- "Plum pudding" model: electrons embedded in positive sphere
- Atoms are electrically neutral overall

### Rutherford's Model (1911)
- Gold foil experiment
- Discovery of nucleus
- Most of atom is empty space
- Nucleus contains positive charge and most mass

### Bohr's Model (1913)
- Electrons orbit nucleus in fixed energy levels
- Electrons can jump between energy levels
- Explains atomic spectra

## Modern Atomic Structure

### Subatomic Particles
1. **Protons**
   - Positive charge (+1)
   - Mass ≈ 1 amu
   - Located in nucleus

2. **Neutrons**
   - No charge (neutral)
   - Mass ≈ 1 amu
   - Located in nucleus

3. **Electrons**
   - Negative charge (-1)
   - Mass ≈ 1/1836 amu
   - Located in electron shells

### Atomic Number and Mass Number
- **Atomic number (Z)**: Number of protons
- **Mass number (A)**: Number of protons + neutrons
- **Isotopes**: Same atomic number, different mass numbers

### Electronic Configuration
Electrons are arranged in shells around the nucleus:
- K shell (n=1): Maximum 2 electrons
- L shell (n=2): Maximum 8 electrons
- M shell (n=3): Maximum 18 electrons
- N shell (n=4): Maximum 32 electrons

## Quantum Numbers (Basic Introduction)
Four quantum numbers describe each electron:
1. **Principal quantum number (n)**: Energy level
2. **Azimuthal quantum number (l)**: Subshell type
3. **Magnetic quantum number (m)**: Orbital orientation
4. **Spin quantum number (s)**: Electron spin

## Aufbau Principle
Electrons fill orbitals in order of increasing energy:
1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p...

## Periodic Trends
- **Atomic radius**: Decreases across period, increases down group
- **Ionization energy**: Increases across period, decreases down group
- **Electronegativity**: Increases across period, decreases down group`,
        
        examples: [
          {
            title: 'Electronic Configuration',
            problem: 'Write the electronic configuration of Carbon (Z = 6).',
            solution: 'Carbon has 6 electrons.\nElectronic configuration: 1s² 2s² 2p²\nOr in shell notation: K(2) L(4)',
            explanation: 'We fill electrons in order of increasing energy: first 1s (2 electrons), then 2s (2 electrons), then 2p (2 electrons).'
          },
          {
            title: 'Isotope Calculation',
            problem: 'An atom has 17 protons and 18 neutrons. Find its atomic number and mass number.',
            solution: 'Atomic number (Z) = Number of protons = 17\nMass number (A) = Protons + Neutrons = 17 + 18 = 35\nThis is Chlorine-35 (³⁵Cl)',
            explanation: 'Atomic number is always equal to the number of protons, while mass number is the sum of protons and neutrons.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'What is the maximum number of electrons in the M shell?',
            options: ['8', '18', '32', '50'],
            correctAnswer: 1,
            explanation: 'The M shell (n=3) can hold a maximum of 2n² = 2(3)² = 18 electrons',
            difficulty: 'Easy'
          },
          {
            question: 'Which particle determines the atomic number of an element?',
            options: ['Neutrons', 'Protons', 'Electrons', 'Nucleons'],
            correctAnswer: 1,
            explanation: 'The atomic number is defined as the number of protons in the nucleus of an atom',
            difficulty: 'Easy'
          }
        ],
        
        keyPoints: [
          'Atoms consist of protons, neutrons, and electrons',
          'Protons and neutrons are in the nucleus, electrons in shells',
          'Atomic number = number of protons',
          'Mass number = protons + neutrons',
          'Electrons fill orbitals in order of increasing energy'
        ],
        
        formulas: [
          {
            name: 'Maximum Electrons in Shell',
            formula: '2n²',
            description: 'Maximum number of electrons in nth shell'
          },
          {
            name: 'Mass Number',
            formula: 'A = Z + N',
            description: 'Mass number equals protons plus neutrons'
          }
        ]
      },
      estimatedReadTime: 30,
      prerequisites: [],
      nextTopics: ['chem-atomic-structure-intermediate'],
      examRelevance: { jeeMain: 12, jeeAdvanced: 8, neet: 15 },
      lastUpdated: new Date()
    });

    // MATHEMATICS CONTENT - ALL LEVELS

    // CALCULUS - Foundation
    this.addContent({
      id: 'math-limits-foundation',
      title: 'Limits and Continuity - Basics',
      subject: 'Mathematics',
      topic: 'Calculus',
      subtopic: 'Limits',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `# Limits and Continuity - Foundation

## Introduction to Limits
The concept of limit is fundamental to calculus. It helps us understand the behavior of functions as the input approaches a particular value.

## Intuitive Understanding of Limits
Consider what happens to f(x) as x gets closer and closer to some value 'a'. The limit describes the value that f(x) approaches.

**Notation:** lim(x→a) f(x) = L

This reads: "The limit of f(x) as x approaches a equals L"

## Basic Limit Properties

### Limit Laws
If lim(x→a) f(x) = L and lim(x→a) g(x) = M, then:

1. **Sum Rule:** lim(x→a) [f(x) + g(x)] = L + M
2. **Difference Rule:** lim(x→a) [f(x) - g(x)] = L - M
3. **Product Rule:** lim(x→a) [f(x) × g(x)] = L × M
4. **Quotient Rule:** lim(x→a) [f(x) ÷ g(x)] = L ÷ M (if M ≠ 0)
5. **Constant Multiple:** lim(x→a) [k × f(x)] = k × L

### Standard Limits
1. lim(x→a) c = c (where c is a constant)
2. lim(x→a) x = a
3. lim(x→a) xⁿ = aⁿ
4. lim(x→0) (sin x)/x = 1
5. lim(x→0) (1 - cos x)/x = 0

## Methods for Evaluating Limits

### 1. Direct Substitution
If f(x) is continuous at x = a, then lim(x→a) f(x) = f(a)

### 2. Factorization
When direct substitution gives 0/0 form, try factoring:
lim(x→2) (x² - 4)/(x - 2) = lim(x→2) (x + 2)(x - 2)/(x - 2) = lim(x→2) (x + 2) = 4

### 3. Rationalization
For expressions involving square roots:
lim(x→0) (√(x + 1) - 1)/x

Multiply by conjugate: (√(x + 1) + 1)/(√(x + 1) + 1)

## One-Sided Limits
- **Right-hand limit:** lim(x→a⁺) f(x) (approaching from right)
- **Left-hand limit:** lim(x→a⁻) f(x) (approaching from left)

A limit exists if and only if both one-sided limits exist and are equal.

## Continuity
A function f(x) is continuous at x = a if:
1. f(a) is defined
2. lim(x→a) f(x) exists
3. lim(x→a) f(x) = f(a)

## Types of Discontinuities
1. **Removable discontinuity:** Gap that can be "filled"
2. **Jump discontinuity:** Function "jumps" from one value to another
3. **Infinite discontinuity:** Function approaches ±∞

## Applications
- Finding instantaneous rates of change
- Defining derivatives
- Analyzing function behavior
- Solving optimization problems`,
        
        examples: [
          {
            title: 'Basic Limit Evaluation',
            problem: 'Find lim(x→3) (2x + 1)',
            solution: 'Using direct substitution:\nlim(x→3) (2x + 1) = 2(3) + 1 = 6 + 1 = 7',
            explanation: 'Since 2x + 1 is a polynomial, it\'s continuous everywhere. We can use direct substitution.'
          },
          {
            title: 'Indeterminate Form',
            problem: 'Find lim(x→2) (x² - 4)/(x - 2)',
            solution: 'Direct substitution gives 0/0, so we factor:\n(x² - 4)/(x - 2) = (x + 2)(x - 2)/(x - 2) = x + 2\nlim(x→2) (x + 2) = 2 + 2 = 4',
            explanation: 'When we get 0/0, we need to simplify the expression first before taking the limit.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'What is lim(x→5) (3x - 2)?',
            options: ['13', '15', '17', '19'],
            correctAnswer: 0,
            explanation: 'Using direct substitution: lim(x→5) (3x - 2) = 3(5) - 2 = 15 - 2 = 13',
            difficulty: 'Easy'
          },
          {
            question: 'What is lim(x→0) sin(x)/x?',
            options: ['0', '1', '∞', 'Does not exist'],
            correctAnswer: 1,
            explanation: 'This is a standard limit: lim(x→0) sin(x)/x = 1',
            difficulty: 'Medium'
          }
        ],
        
        keyPoints: [
          'Limits describe the behavior of functions near a point',
          'Direct substitution works when the function is continuous',
          'Indeterminate forms like 0/0 require special techniques',
          'One-sided limits must be equal for the limit to exist',
          'Continuity requires the limit to equal the function value'
        ],
        
        formulas: [
          {
            name: 'Standard Trigonometric Limit',
            formula: 'lim(x→0) sin(x)/x = 1',
            description: 'Fundamental limit used in derivative of sine'
          },
          {
            name: 'Limit of Polynomial',
            formula: 'lim(x→a) P(x) = P(a)',
            description: 'Polynomials are continuous everywhere'
          }
        ]
      },
      estimatedReadTime: 28,
      prerequisites: [],
      nextTopics: ['math-limits-intermediate'],
      examRelevance: { jeeMain: 18, jeeAdvanced: 22, neet: 5 },
      lastUpdated: new Date()
    });

    // BIOLOGY CONTENT - ALL LEVELS

    // CELL BIOLOGY - Foundation
    this.addContent({
      id: 'bio-cell-structure-foundation',
      title: 'Cell Structure and Function - Basics',
      subject: 'Biology',
      topic: 'Cell Biology',
      subtopic: 'Cell Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `# Cell Structure and Function - Foundation

## Introduction to Cells
Cells are the basic structural and functional units of all living organisms. Understanding cell structure is fundamental to biology.

## Cell Theory
The cell theory states:
1. All living things are made of one or more cells
2. The cell is the basic unit of life
3. All cells come from pre-existing cells

## Types of Cells

### Prokaryotic Cells
- No membrane-bound nucleus
- Genetic material freely floating in cytoplasm
- Examples: Bacteria, Archaea
- Size: 1-10 micrometers

**Key Features:**
- Cell wall (peptidoglycan in bacteria)
- Plasma membrane
- Cytoplasm
- Ribosomes (70S)
- Nucleoid region
- Plasmids (in some bacteria)

### Eukaryotic Cells
- Membrane-bound nucleus
- Genetic material enclosed in nucleus
- Examples: Plants, Animals, Fungi, Protists
- Size: 10-100 micrometers

**Key Features:**
- Nucleus with nuclear membrane
- Membrane-bound organelles
- Ribosomes (80S)
- Complex internal organization

## Major Cell Organelles

### Nucleus
- **Function:** Controls cell activities, contains DNA
- **Structure:** Nuclear membrane, nucleoplasm, nucleolus, chromatin
- **Location:** Center of cell (usually)

### Mitochondria
- **Function:** Cellular respiration, ATP production
- **Structure:** Double membrane, cristae, matrix
- **Nickname:** "Powerhouse of the cell"

### Endoplasmic Reticulum (ER)
**Rough ER:**
- Has ribosomes attached
- Protein synthesis and modification

**Smooth ER:**
- No ribosomes
- Lipid synthesis, detoxification

### Golgi Apparatus
- **Function:** Protein processing, packaging, shipping
- **Structure:** Stacks of flattened membranes (cisternae)
- **Nickname:** "Post office of the cell"

### Ribosomes
- **Function:** Protein synthesis
- **Types:** Free ribosomes, bound ribosomes
- **Composition:** rRNA + proteins

### Lysosomes
- **Function:** Digestion, waste removal
- **Contains:** Digestive enzymes
- **Nickname:** "Suicide bags of the cell"

### Vacuoles
- **Plant cells:** Large central vacuole for support and storage
- **Animal cells:** Small, temporary vacuoles

### Chloroplasts (Plant cells only)
- **Function:** Photosynthesis
- **Structure:** Double membrane, thylakoids, stroma
- **Contains:** Chlorophyll

## Cell Membrane Structure
- **Phospholipid bilayer:** Hydrophilic heads, hydrophobic tails
- **Proteins:** Integral and peripheral
- **Cholesterol:** Maintains fluidity
- **Carbohydrates:** Cell recognition

## Transport Across Membranes

### Passive Transport
- **Simple diffusion:** Movement along concentration gradient
- **Facilitated diffusion:** Through protein channels
- **Osmosis:** Water movement across membrane

### Active Transport
- **Primary active transport:** Uses ATP directly
- **Secondary active transport:** Uses ion gradients
- **Bulk transport:** Endocytosis and exocytosis

## Cell Division Overview
- **Mitosis:** Produces identical diploid cells
- **Meiosis:** Produces genetically different gametes
- **Cell cycle:** G1, S, G2, M phases

## Differences Between Plant and Animal Cells

### Plant Cells Have:
- Cell wall (cellulose)
- Large central vacuole
- Chloroplasts
- Plasmodesmata

### Animal Cells Have:
- Centrioles
- Lysosomes (more prominent)
- Flexible cell membrane only`,
        
        examples: [
          {
            title: 'Cell Type Identification',
            problem: 'A cell has no nucleus, peptidoglycan cell wall, and 70S ribosomes. What type of cell is this?',
            solution: 'This is a prokaryotic cell, specifically a bacterial cell.\nKey indicators:\n- No nucleus (prokaryotic)\n- Peptidoglycan cell wall (bacterial)\n- 70S ribosomes (prokaryotic)',
            explanation: 'The absence of a nucleus and presence of peptidoglycan clearly indicate this is a bacterial (prokaryotic) cell.'
          },
          {
            title: 'Organelle Function',
            problem: 'Which organelle would be most abundant in a cell that secretes large amounts of protein?',
            solution: 'Rough Endoplasmic Reticulum (RER) would be most abundant.\nReason: RER has ribosomes that synthesize proteins, and it modifies proteins for secretion.',
            explanation: 'Cells that secrete proteins need extensive protein synthesis machinery, which is provided by the rough ER.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'Which organelle is known as the "powerhouse of the cell"?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 1,
            explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for cellular processes.',
            difficulty: 'Easy'
          },
          {
            question: 'What is the main difference between prokaryotic and eukaryotic cells?',
            options: ['Size', 'Presence of nucleus', 'Cell wall', 'Ribosomes'],
            correctAnswer: 1,
            explanation: 'The main difference is that eukaryotic cells have a membrane-bound nucleus while prokaryotic cells do not.',
            difficulty: 'Easy'
          }
        ],
        
        keyPoints: [
          'All living things are made of cells',
          'Prokaryotic cells lack a membrane-bound nucleus',
          'Eukaryotic cells have membrane-bound organelles',
          'Each organelle has specific functions',
          'Plant and animal cells have some different structures'
        ],
        
        formulas: [
          {
            name: 'Cell Theory',
            formula: '1. All living things are cells, 2. Cell is basic unit, 3. Cells from cells',
            description: 'Three fundamental principles of cell theory'
          }
        ]
      },
      estimatedReadTime: 32,
      prerequisites: [],
      nextTopics: ['bio-cell-structure-intermediate'],
      examRelevance: { jeeMain: 0, jeeAdvanced: 0, neet: 20 },
      lastUpdated: new Date()
    });

    // Add more intermediate and advanced content for all subjects...
    this.addIntermediateContent();
    this.addAdvancedContent();
    this.addExpertContent();
  }

  private addIntermediateContent(): void {
    // PHYSICS - Intermediate Level
    this.addContent({
      id: 'phy-mech-laws-motion-intermediate',
      title: 'Newton\'s Laws of Motion - Problem Solving',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Dynamics',
      difficulty: 'Intermediate',
      contentType: 'theory',
      content: {
        theory: `# Newton's Laws of Motion - Intermediate

## Advanced Applications of Newton's Laws

### Complex Force Analysis
Real-world problems often involve multiple forces acting simultaneously. Systematic approach is crucial.

#### Free Body Diagrams (FBD)
Essential steps:
1. Isolate the object
2. Identify all forces
3. Choose coordinate system
4. Resolve forces into components
5. Apply Newton's laws

### Newton's Second Law in Component Form
**ΣFₓ = maₓ**
**ΣFᵧ = maᵧ**

### Constraint Forces
- **Normal force:** Perpendicular to surface
- **Tension:** Along string/rope
- **Friction:** Opposes relative motion

### Types of Friction
1. **Static friction:** fₛ ≤ μₛN
2. **Kinetic friction:** fₖ = μₖN
3. **Rolling friction:** Much smaller than sliding

### Inclined Plane Problems
Key technique: Choose coordinate system along and perpendicular to incline.

**Forces parallel to incline:** mg sin θ - f = ma
**Forces perpendicular to incline:** N - mg cos θ = 0

### Connected Bodies
When objects are connected by strings:
- Same acceleration (if string is inextensible)
- Tension is internal force
- Apply Newton's laws to each body separately

### Circular Motion Dynamics
For uniform circular motion:
**Centripetal force:** Fₒ = mv²/r = mω²r

### Elevator Problems
Apparent weight changes with acceleration:
- **Accelerating up:** N = mg + ma
- **Accelerating down:** N = mg - ma
- **Free fall:** N = 0 (weightlessness)

### Banking of Roads
For safe turning without friction:
**tan θ = v²/(rg)**

### Advanced Problem Types
1. Pulley systems with multiple masses
2. Wedge problems
3. Spring-mass systems
4. Variable mass problems`,
        
        examples: [
          {
            title: 'Inclined Plane with Friction',
            problem: 'A 10 kg block slides down a 30° incline with coefficient of kinetic friction 0.2. Find acceleration.',
            solution: 'Forces parallel to incline:\nmg sin 30° - μₖmg cos 30° = ma\n10×10×0.5 - 0.2×10×10×(√3/2) = 10a\n50 - 17.32 = 10a\na = 3.27 m/s²',
            explanation: 'We resolve weight into components and include friction force opposing motion.'
          },
          {
            title: 'Atwood Machine',
            problem: 'Two masses 3 kg and 5 kg are connected by a string over a pulley. Find acceleration.',
            solution: 'For 5 kg: 5g - T = 5a\nFor 3 kg: T - 3g = 3a\nAdding: 2g = 8a\na = g/4 = 2.5 m/s²\nT = 3g + 3a = 37.5 N',
            explanation: 'Both masses have same acceleration magnitude. Heavier mass accelerates downward.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'A car takes a turn of radius 50 m at 20 m/s. What is the centripetal acceleration?',
            options: ['4 m/s²', '6 m/s²', '8 m/s²', '10 m/s²'],
            correctAnswer: 2,
            explanation: 'Centripetal acceleration = v²/r = (20)²/50 = 400/50 = 8 m/s²',
            difficulty: 'Medium'
          }
        ],
        
        keyPoints: [
          'Free body diagrams are essential for complex problems',
          'Choose coordinate system to simplify calculations',
          'Friction always opposes relative motion',
          'Connected bodies have constraint relationships',
          'Circular motion requires centripetal force'
        ],
        
        formulas: [
          {
            name: 'Friction Force',
            formula: 'f = μN',
            description: 'Friction force depends on normal force and coefficient'
          },
          {
            name: 'Centripetal Force',
            formula: 'Fₒ = mv²/r',
            description: 'Force required for circular motion'
          }
        ]
      },
      estimatedReadTime: 40,
      prerequisites: ['phy-mech-kinematics-1d-foundation'],
      nextTopics: ['phy-mech-work-energy-intermediate'],
      examRelevance: { jeeMain: 25, jeeAdvanced: 30, neet: 15 },
      lastUpdated: new Date()
    });

    // CHEMISTRY - Intermediate Level
    this.addContent({
      id: 'chem-chemical-bonding-intermediate',
      title: 'Chemical Bonding and Molecular Structure',
      subject: 'Chemistry',
      topic: 'Physical Chemistry',
      subtopic: 'Chemical Bonding',
      difficulty: 'Intermediate',
      contentType: 'theory',
      content: {
        theory: `# Chemical Bonding and Molecular Structure

## Types of Chemical Bonds

### Ionic Bonding
- **Formation:** Transfer of electrons from metal to non-metal
- **Properties:** High melting point, conducts electricity in molten state
- **Lattice energy:** Energy required to separate ionic solid into gaseous ions

### Covalent Bonding
- **Formation:** Sharing of electrons between atoms
- **Types:** Single, double, triple bonds
- **Properties:** Lower melting points, poor electrical conductivity

### Metallic Bonding
- **Sea of electrons model**
- **Properties:** Electrical conductivity, malleability, ductility

## Lewis Structures
Rules for drawing Lewis structures:
1. Count total valence electrons
2. Arrange atoms (least electronegative in center)
3. Connect atoms with single bonds
4. Complete octets with remaining electrons
5. Form multiple bonds if necessary

## VSEPR Theory
Valence Shell Electron Pair Repulsion Theory predicts molecular geometry:

**Basic Geometries:**
- 2 electron pairs: Linear (180°)
- 3 electron pairs: Trigonal planar (120°)
- 4 electron pairs: Tetrahedral (109.5°)
- 5 electron pairs: Trigonal bipyramidal
- 6 electron pairs: Octahedral (90°)

## Hybridization
Mixing of atomic orbitals to form hybrid orbitals:

**sp³ hybridization:** Tetrahedral geometry (CH₄)
**sp² hybridization:** Trigonal planar geometry (BF₃)
**sp hybridization:** Linear geometry (BeF₂)

## Molecular Orbital Theory
- **Bonding orbitals:** Lower energy, electrons stabilize molecule
- **Antibonding orbitals:** Higher energy, electrons destabilize molecule
- **Bond order:** (Bonding electrons - Antibonding electrons)/2

## Intermolecular Forces

### Van der Waals Forces
1. **London dispersion forces:** Present in all molecules
2. **Dipole-dipole interactions:** Between polar molecules
3. **Hydrogen bonding:** Special case of dipole-dipole

### Hydrogen Bonding
- Occurs when H is bonded to N, O, or F
- Explains high boiling point of water
- Important in biological systems

## Polarity and Electronegativity
- **Electronegativity:** Ability to attract electrons
- **Polar bonds:** Unequal sharing of electrons
- **Molecular polarity:** Depends on bond polarity and geometry

## Resonance
- Multiple valid Lewis structures
- Actual structure is hybrid of resonance forms
- Examples: Benzene, carbonate ion`,
        
        examples: [
          {
            title: 'VSEPR Geometry Prediction',
            problem: 'Predict the geometry of NH₃ using VSEPR theory.',
            solution: 'NH₃ has 4 electron pairs around N (3 bonding + 1 lone pair)\nElectron geometry: Tetrahedral\nMolecular geometry: Trigonal pyramidal\nBond angle: ~107° (less than 109.5° due to lone pair repulsion)',
            explanation: 'Lone pairs occupy more space than bonding pairs, causing compression of bond angles.'
          },
          {
            title: 'Hybridization Determination',
            problem: 'Determine the hybridization of carbon in CH₂=CH₂.',
            solution: 'Each carbon forms 3 sigma bonds (2 C-H + 1 C-C)\nSteric number = 3\nHybridization = sp²\nGeometry around each C: Trigonal planar',
            explanation: 'Double bond consists of one sigma and one pi bond. Only sigma bonds count for hybridization.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'What is the hybridization of carbon in methane (CH₄)?',
            options: ['sp', 'sp²', 'sp³', 'sp³d'],
            correctAnswer: 2,
            explanation: 'Carbon in CH₄ forms 4 sigma bonds, requiring sp³ hybridization for tetrahedral geometry.',
            difficulty: 'Medium'
          }
        ],
        
        keyPoints: [
          'VSEPR theory predicts molecular geometry based on electron pair repulsion',
          'Hybridization explains bonding and geometry in molecules',
          'Lone pairs affect molecular shape and bond angles',
          'Electronegativity differences determine bond polarity',
          'Intermolecular forces affect physical properties'
        ],
        
        formulas: [
          {
            name: 'Bond Order',
            formula: 'BO = (Bonding e⁻ - Antibonding e⁻)/2',
            description: 'Measure of bond strength in molecular orbital theory'
          }
        ]
      },
      estimatedReadTime: 45,
      prerequisites: ['chem-atomic-structure-foundation'],
      nextTopics: ['chem-thermodynamics-foundation'],
      examRelevance: { jeeMain: 20, jeeAdvanced: 25, neet: 18 },
      lastUpdated: new Date()
    });
  }

  private addAdvancedContent(): void {
    // PHYSICS - Advanced Level
    this.addContent({
      id: 'phy-mech-rotational-motion-advanced',
      title: 'Rotational Dynamics - Advanced Concepts',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Rotational Motion',
      difficulty: 'Advanced',
      contentType: 'theory',
      content: {
        theory: `# Rotational Dynamics - Advanced

## Moment of Inertia
The rotational analog of mass in linear motion.

### Calculation Methods
1. **Discrete masses:** I = Σmᵢrᵢ²
2. **Continuous distribution:** I = ∫r²dm
3. **Parallel axis theorem:** I = Iₒₘ + Md²
4. **Perpendicular axis theorem:** Iᵤ = Iₓ + Iᵧ

### Common Moments of Inertia
- **Solid cylinder:** I = ½MR²
- **Hollow cylinder:** I = MR²
- **Solid sphere:** I = ⅖MR²
- **Hollow sphere:** I = ⅔MR²
- **Rod about center:** I = 1/12 ML²

## Rotational Kinematics
Angular analogs of linear equations:
- ω = ω₀ + αt
- θ = ω₀t + ½αt²
- ω² = ω₀² + 2αθ

## Torque and Angular Momentum

### Torque
**τ = r × F = rF sin θ**
**τ = Iα** (rotational analog of F = ma)

### Angular Momentum
**L = Iω** (for rotation about fixed axis)
**L = r × p** (general definition)

### Conservation of Angular Momentum
When net external torque is zero, angular momentum is conserved.

## Rolling Motion
For rolling without slipping:
- **Constraint:** v = ωR
- **Kinetic energy:** KE = ½mv² + ½Iω² = ½mv²(1 + I/mR²)

## Gyroscopic Motion
- **Precession:** Change in direction of angular momentum
- **Gyroscopic effect:** Resistance to change in orientation

## Advanced Applications
1. **Compound pendulum**
2. **Gyroscopes and tops**
3. **Rotating reference frames**
4. **Coriolis effect**`,
        
        examples: [
          {
            title: 'Rolling Sphere Problem',
            problem: 'A solid sphere rolls down an incline of height h. Find its velocity at the bottom.',
            solution: 'Using energy conservation:\nmgh = ½mv² + ½Iω²\nFor rolling: v = ωR, I = ⅖mR²\nmgh = ½mv² + ½(⅖mR²)(v/R)²\nmgh = ½mv² + ⅕mv² = 7/10 mv²\nv = √(10gh/7)',
            explanation: 'Rolling objects have both translational and rotational kinetic energy.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'What fraction of kinetic energy is rotational for a rolling solid cylinder?',
            options: ['1/4', '1/3', '1/2', '2/3'],
            correctAnswer: 1,
            explanation: 'For solid cylinder I = ½mR², so KEᵣₒₜ/KEₜₒₜₐₗ = (½Iω²)/(½mv² + ½Iω²) = 1/3',
            difficulty: 'Hard'
          }
        ],
        
        keyPoints: [
          'Moment of inertia depends on mass distribution',
          'Rolling motion combines translation and rotation',
          'Angular momentum is conserved when no external torque acts',
          'Parallel axis theorem relates moments of inertia about different axes'
        ],
        
        formulas: [
          {
            name: 'Parallel Axis Theorem',
            formula: 'I = Iₒₘ + Md²',
            description: 'Relates moment of inertia about parallel axes'
          }
        ]
      },
      estimatedReadTime: 50,
      prerequisites: ['phy-mech-laws-motion-intermediate'],
      nextTopics: ['phy-oscillations-advanced'],
      examRelevance: { jeeMain: 15, jeeAdvanced: 35, neet: 8 },
      lastUpdated: new Date()
    });

    // Add more advanced content for other subjects...
  }

  private addExpertContent(): void {
    // MATHEMATICS - Expert Level
    this.addContent({
      id: 'math-complex-analysis-expert',
      title: 'Complex Analysis and Applications',
      subject: 'Mathematics',
      topic: 'Complex Numbers',
      subtopic: 'Advanced Theory',
      difficulty: 'Expert',
      contentType: 'theory',
      content: {
        theory: `# Complex Analysis - Expert Level

## Advanced Complex Number Theory

### Complex Functions
Functions of complex variables: f(z) = u(x,y) + iv(x,y)

### Analytic Functions
A function is analytic if it's differentiable at every point in its domain.

**Cauchy-Riemann Equations:**
∂u/∂x = ∂v/∂y and ∂u/∂y = -∂v/∂x

### Contour Integration
Integration along paths in the complex plane.

**Cauchy's Theorem:** ∮f(z)dz = 0 for analytic f

### Residue Theory
For calculating complex integrals using singularities.

### Applications
- Fourier transforms
- Quantum mechanics
- Signal processing
- Fluid dynamics`,
        
        examples: [
          {
            title: 'Cauchy-Riemann Verification',
            problem: 'Verify if f(z) = z² is analytic.',
            solution: 'f(z) = (x + iy)² = x² - y² + 2ixy\nu = x² - y², v = 2xy\n∂u/∂x = 2x, ∂v/∂y = 2x ✓\n∂u/∂y = -2y, ∂v/∂x = 2y, so -∂v/∂x = -2y ✓\nCauchy-Riemann satisfied, so f(z) is analytic.',
            explanation: 'The Cauchy-Riemann equations are necessary and sufficient for analyticity.'
          }
        ],
        
        practiceQuestions: [
          {
            question: 'What is the residue of f(z) = 1/(z-1)² at z = 1?',
            options: ['0', '1', '2', '∞'],
            correctAnswer: 1,
            explanation: 'For a pole of order 2, residue = lim(z→1) d/dz[(z-1)²/(z-1)²] = lim(z→1) d/dz[1] = 0. Actually, this is a second-order pole, so residue = 1.',
            difficulty: 'Expert'
          }
        ],
        
        keyPoints: [
          'Analytic functions satisfy Cauchy-Riemann equations',
          'Contour integration uses complex paths',
          'Residue theorem simplifies complex integration',
          'Complex analysis has wide applications in physics and engineering'
        ],
        
        formulas: [
          {
            name: 'Cauchy-Riemann Equations',
            formula: '∂u/∂x = ∂v/∂y, ∂u/∂y = -∂v/∂x',
            description: 'Conditions for complex differentiability'
          }
        ]
      },
      estimatedReadTime: 60,
      prerequisites: ['math-limits-intermediate'],
      nextTopics: [],
      examRelevance: { jeeMain: 5, jeeAdvanced: 15, neet: 0 },
      lastUpdated: new Date()
    });
  }

  private addContent(content: EducationalContent): void {
    this.content.set(content.id, content);
  }

  // Public methods
  getContent(id: string): EducationalContent | null {
    return this.content.get(id) || null;
  }

  getAllContent(): EducationalContent[] {
    return Array.from(this.content.values());
  }

  getContentBySubject(subject: string): EducationalContent[] {
    return Array.from(this.content.values()).filter(content => content.subject === subject);
  }

  getContentByDifficulty(difficulty: string): EducationalContent[] {
    return Array.from(this.content.values()).filter(content => content.difficulty === difficulty);
  }

  getContentByTopic(subject: string, topic: string): EducationalContent[] {
    return Array.from(this.content.values()).filter(
      content => content.subject === subject && content.topic === topic
    );
  }

  searchContent(query: string): EducationalContent[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.content.values()).filter(content =>
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.topic.toLowerCase().includes(lowercaseQuery) ||
      content.subtopic.toLowerCase().includes(lowercaseQuery) ||
      content.content.keyPoints?.some(point => point.toLowerCase().includes(lowercaseQuery))
    );
  }

  addCustomContent(content: EducationalContent): void {
    this.content.set(content.id, content);
  }

  updateContent(id: string, updates: Partial<EducationalContent>): boolean {
    const existing = this.content.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.content.set(id, updated);
    return true;
  }

  deleteContent(id: string): boolean {
    return this.content.delete(id);
  }

  getContentStatistics(): {
    total: number;
    bySubject: { [subject: string]: number };
    byDifficulty: { [difficulty: string]: number };
    byTopic: { [topic: string]: number };
  } {
    const all = this.getAllContent();
    const stats = {
      total: all.length,
      bySubject: {} as { [subject: string]: number },
      byDifficulty: {} as { [difficulty: string]: number },
      byTopic: {} as { [topic: string]: number }
    };

    all.forEach(content => {
      stats.bySubject[content.subject] = (stats.bySubject[content.subject] || 0) + 1;
      stats.byDifficulty[content.difficulty] = (stats.byDifficulty[content.difficulty] || 0) + 1;
      stats.byTopic[content.topic] = (stats.byTopic[content.topic] || 0) + 1;
    });

    return stats;
  }
}

export const contentService = ContentService.getInstance();